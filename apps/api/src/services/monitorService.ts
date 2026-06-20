import { promises as fs } from 'fs';
import * as path from 'path';
import * as nodemailer from 'nodemailer';
import { MonitorEntry, MonitorHistoryPoint, Grade } from '@watchpost/shared-types';
import { auditSite } from './siteAuditService';

const DATA_DIR  = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'monitors.json');
const MAX_HISTORY = 30;

// ── Persistence ───────────────────────────────────────────────────────────────

async function readMonitors(): Promise<MonitorEntry[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as MonitorEntry[];
  } catch {
    return [];
  }
}

async function writeMonitors(monitors: MonitorEntry[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(monitors, null, 2), 'utf-8');
}

// ── CRUD ─────────────────────────────────────────────────────────────────────

export async function listMonitors(): Promise<MonitorEntry[]> {
  return readMonitors();
}

export async function addMonitor(data: Omit<MonitorEntry, 'id' | 'createdAt' | 'history'>): Promise<MonitorEntry> {
  const monitors = await readMonitors();
  const entry: MonitorEntry = {
    ...data,
    id:        Math.random().toString(36).slice(2, 10),
    createdAt: new Date().toISOString(),
    history:   [],
  };
  monitors.push(entry);
  await writeMonitors(monitors);
  return entry;
}

export async function removeMonitor(id: string): Promise<boolean> {
  const monitors = await readMonitors();
  const filtered = monitors.filter((m) => m.id !== id);
  if (filtered.length === monitors.length) return false;
  await writeMonitors(filtered);
  return true;
}

// ── Email transport (optional — requires SMTP env vars) ────────────────────────

function createTransport(): nodemailer.Transporter | null {
  const host = process.env['SMTP_HOST'];
  if (!host) return null;
  return nodemailer.createTransport({
    host,
    port:   parseInt(process.env['SMTP_PORT'] ?? '587', 10),
    secure: process.env['SMTP_SECURE'] === 'true',
    auth: {
      user: process.env['SMTP_USER'],
      pass: process.env['SMTP_PASS'],
    },
  });
}

// ── Alert ─────────────────────────────────────────────────────────────────────

async function sendAlerts(
  monitor: MonitorEntry,
  prevScore: number | undefined,
  currentScore: number,
  currentGrade: Grade,
  newFindings: number,
  resolvedFindings: number,
): Promise<void> {
  const subject = `[Watchpost] ${monitor.domain} — score ${currentScore}/${currentGrade} (threshold: ${monitor.threshold})`;
  const body = [
    `Domain: ${monitor.domain}`,
    `Current score: ${currentScore}/100 (${currentGrade})`,
    prevScore !== undefined ? `Previous score: ${prevScore}/100` : '',
    `Threshold: ${monitor.threshold}`,
    newFindings     > 0 ? `⚠ ${newFindings} new issue(s) appeared` : '',
    resolvedFindings > 0 ? `✓ ${resolvedFindings} issue(s) resolved` : '',
    '',
    `Scan time: ${new Date().toISOString()}`,
  ].filter(Boolean).join('\n');

  // Webhook alert
  if (monitor.webhook) {
    try {
      await fetch(monitor.webhook, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: monitor.domain, currentScore, currentGrade,
          previousScore: prevScore, threshold: monitor.threshold,
          newFindings, resolvedFindings,
          alertType: 'score_below_threshold',
          message: subject,
        }),
        signal: AbortSignal.timeout(10_000),
      });
      console.log(`[monitor] Webhook alert sent for ${monitor.domain}`);
    } catch (err) {
      console.error(`[monitor] Webhook failed for ${monitor.domain}:`, err);
    }
  }

  // Email alert
  if (monitor.email) {
    const transport = createTransport();
    if (transport) {
      try {
        await transport.sendMail({
          from:    process.env['SMTP_FROM'] ?? process.env['SMTP_USER'],
          to:      monitor.email,
          subject,
          text:    body,
        });
        console.log(`[monitor] Email alert sent to ${monitor.email} for ${monitor.domain}`);
      } catch (err) {
        console.error(`[monitor] Email failed for ${monitor.domain}:`, err);
      }
    } else {
      console.warn(`[monitor] Email configured for ${monitor.domain} but no SMTP env vars set (SMTP_HOST, SMTP_USER, SMTP_PASS).`);
    }
  }
}

// ── Diff computation ──────────────────────────────────────────────────────────

function computeDiff(
  prevFindingKeys: string[],
  currentFindingKeys: string[],
): { newFindings: number; resolvedFindings: number } {
  const prevFailed    = new Set(prevFindingKeys);
  const currentFailed = new Set(currentFindingKeys);
  const newFindings      = [...currentFailed].filter((k) => !prevFailed.has(k)).length;
  const resolvedFindings = [...prevFailed].filter((k) => !currentFailed.has(k)).length;
  return { newFindings, resolvedFindings };
}

// ── Scan a single monitor ────────────────────────────────────────────────────

export async function runMonitor(id: string): Promise<MonitorEntry | null> {
  const monitors = await readMonitors();
  const idx = monitors.findIndex((m) => m.id === id);
  if (idx === -1) return null;

  const monitor = monitors[idx];
  console.log(`[monitor] Scanning ${monitor.domain}…`);

  try {
    const audit    = await auditSite(monitor.domain);
    const newScore = audit.overallScore;
    const newGrade = audit.overallGrade;

    // Collect failed finding keys for diff
    const currentFailedKeys = [
      ...(audit.vuln?.findings.filter((f) => !f.passed).map((f) => f.key) ?? []),
      ...(audit.headers?.details.filter((d) => !d.passed && !d.informational).map((d) => d.key ?? d.label) ?? []),
    ];

    // Compute diff against previous scan
    const prevFailedKeys = monitor._lastFailedKeys ?? [];
    const { newFindings, resolvedFindings } = computeDiff(prevFailedKeys, currentFailedKeys);

    // Append to history (cap at MAX_HISTORY)
    const historyPoint: MonitorHistoryPoint = { score: newScore, grade: newGrade, scannedAt: new Date().toISOString() };
    const history = [...(monitor.history ?? []), historyPoint].slice(-MAX_HISTORY);

    monitors[idx] = {
      ...monitor,
      lastScore:          newScore,
      lastGrade:          newGrade,
      lastScannedAt:      historyPoint.scannedAt,
      history,
      lastNewFindings:     newFindings,
      lastResolvedFindings: resolvedFindings,
      _lastFailedKeys:      currentFailedKeys,
    };

    await writeMonitors(monitors);

    // Alert if score dropped below threshold
    if (newScore < monitor.threshold) {
      await sendAlerts(monitors[idx], monitor.lastScore, newScore, newGrade, newFindings, resolvedFindings);
    }

    return monitors[idx];
  } catch (err) {
    console.error(`[monitor] Scan failed for ${monitor.domain}:`, err);
    return monitor;
  }
}

// ── Scheduler ────────────────────────────────────────────────────────────────

const FREQUENCY_MS: Record<MonitorEntry['frequency'], number> = {
  daily:  24 * 60 * 60 * 1000,
  weekly:  7 * 24 * 60 * 60 * 1000,
};

function isDue(monitor: MonitorEntry): boolean {
  if (!monitor.lastScannedAt) return true;
  const elapsed = Date.now() - new Date(monitor.lastScannedAt).getTime();
  return elapsed >= FREQUENCY_MS[monitor.frequency];
}

async function checkDueMonitors(): Promise<void> {
  const monitors = await readMonitors();
  await Promise.all(monitors.filter(isDue).map((m) => runMonitor(m.id)));
}

export function startMonitorScheduler(): void {
  setInterval(() => {
    checkDueMonitors().catch((err) => console.error('[monitor] scheduler error:', err));
  }, 15 * 60 * 1000);

  checkDueMonitors().catch(() => { /* silent on startup */ });
  console.log('[monitor] Scheduler started (checks every 15 min)');
}
