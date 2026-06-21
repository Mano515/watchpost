import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import * as nodemailer from 'nodemailer';
import { MonitorEntry, MonitorHistoryPoint, Grade } from '@watchpost/shared-types';
import { auditSite } from './siteAuditService';

const DATA_DIR = process.env['DATA_DIR'] ?? path.join(__dirname, '../../data');
fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'watchpost.db'));
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS monitors (
    id                     TEXT PRIMARY KEY,
    domain                 TEXT NOT NULL,
    threshold              INTEGER NOT NULL DEFAULT 80,
    frequency              TEXT NOT NULL DEFAULT 'daily',
    webhook                TEXT,
    email                  TEXT,
    created_at             TEXT NOT NULL,
    last_score             INTEGER,
    last_grade             TEXT,
    last_scanned_at        TEXT,
    last_new_findings      INTEGER DEFAULT 0,
    last_resolved_findings INTEGER DEFAULT 0,
    last_failed_keys       TEXT DEFAULT '[]',
    history                TEXT DEFAULT '[]'
  )
`);

const MAX_HISTORY = 30;

// ── Row mapping ───────────────────────────────────────────────────────────────

type Row = Record<string, unknown>;

function rowToEntry(row: Row): MonitorEntry {
  return {
    id:                   row['id'] as string,
    domain:               row['domain'] as string,
    threshold:            row['threshold'] as number,
    frequency:            row['frequency'] as 'daily' | 'weekly',
    webhook:              (row['webhook'] as string | null) ?? undefined,
    email:                (row['email'] as string | null) ?? undefined,
    createdAt:            row['created_at'] as string,
    lastScore:            (row['last_score'] as number | null) ?? undefined,
    lastGrade:            (row['last_grade'] as Grade | null) ?? undefined,
    lastScannedAt:        (row['last_scanned_at'] as string | null) ?? undefined,
    lastNewFindings:      (row['last_new_findings'] as number | null) ?? undefined,
    lastResolvedFindings: (row['last_resolved_findings'] as number | null) ?? undefined,
    _lastFailedKeys:      JSON.parse(row['last_failed_keys'] as string ?? '[]') as string[],
    history:              JSON.parse(row['history'] as string ?? '[]') as MonitorHistoryPoint[],
  };
}

// ── CRUD ─────────────────────────────────────────────────────────────────────

export function listMonitors(): Promise<MonitorEntry[]> {
  const rows = db.prepare('SELECT * FROM monitors ORDER BY created_at DESC').all() as Row[];
  return Promise.resolve(rows.map(rowToEntry));
}

export function addMonitor(data: Omit<MonitorEntry, 'id' | 'createdAt' | 'history'>): Promise<MonitorEntry> {
  const id        = Math.random().toString(36).slice(2, 10);
  const createdAt = new Date().toISOString();
  db.prepare(
    'INSERT INTO monitors (id, domain, threshold, frequency, webhook, email, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
  ).run(id, data.domain, data.threshold, data.frequency, data.webhook ?? null, data.email ?? null, createdAt);
  return Promise.resolve({ ...data, id, createdAt, history: [] });
}

export function removeMonitor(id: string): Promise<boolean> {
  const result = db.prepare('DELETE FROM monitors WHERE id = ?').run(id);
  return Promise.resolve(result.changes > 0);
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
    newFindings      > 0 ? `⚠ ${newFindings} new issue(s) appeared` : '',
    resolvedFindings > 0 ? `✓ ${resolvedFindings} issue(s) resolved` : '',
    '',
    `Scan time: ${new Date().toISOString()}`,
  ].filter(Boolean).join('\n');

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
      console.warn(`[monitor] Email configured for ${monitor.domain} but SMTP_HOST env var is not set.`);
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
  return {
    newFindings:      [...currentFailed].filter((k) => !prevFailed.has(k)).length,
    resolvedFindings: [...prevFailed].filter((k) => !currentFailed.has(k)).length,
  };
}

// ── Scan a single monitor ────────────────────────────────────────────────────

export async function runMonitor(id: string): Promise<MonitorEntry | null> {
  const row = db.prepare('SELECT * FROM monitors WHERE id = ?').get(id) as Row | undefined;
  if (!row) return null;

  const monitor = rowToEntry(row);
  console.log(`[monitor] Scanning ${monitor.domain}…`);

  try {
    const audit    = await auditSite(monitor.domain);
    const newScore = audit.overallScore;
    const newGrade = audit.overallGrade;

    const currentFailedKeys = [
      ...(audit.vuln?.findings.filter((f) => !f.passed).map((f) => f.key) ?? []),
      ...(audit.headers?.details.filter((d) => !d.passed && !d.informational).map((d) => d.key ?? d.label) ?? []),
    ];

    const prevFailedKeys = monitor._lastFailedKeys ?? [];
    const { newFindings, resolvedFindings } = computeDiff(prevFailedKeys, currentFailedKeys);

    const historyPoint: MonitorHistoryPoint = {
      score: newScore, grade: newGrade, scannedAt: new Date().toISOString(),
    };
    const history = [...(monitor.history ?? []), historyPoint].slice(-MAX_HISTORY);

    db.prepare(`
      UPDATE monitors
      SET last_score = ?, last_grade = ?, last_scanned_at = ?,
          last_new_findings = ?, last_resolved_findings = ?,
          last_failed_keys = ?, history = ?
      WHERE id = ?
    `).run(
      newScore, newGrade, historyPoint.scannedAt,
      newFindings, resolvedFindings,
      JSON.stringify(currentFailedKeys), JSON.stringify(history),
      id,
    );

    const updated: MonitorEntry = {
      ...monitor,
      lastScore:           newScore,
      lastGrade:           newGrade,
      lastScannedAt:       historyPoint.scannedAt,
      history,
      lastNewFindings:      newFindings,
      lastResolvedFindings: resolvedFindings,
      _lastFailedKeys:      currentFailedKeys,
    };

    if (newScore < monitor.threshold) {
      await sendAlerts(updated, monitor.lastScore, newScore, newGrade, newFindings, resolvedFindings);
    }

    return updated;
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
  return Date.now() - new Date(monitor.lastScannedAt).getTime() >= FREQUENCY_MS[monitor.frequency];
}

async function checkDueMonitors(): Promise<void> {
  const monitors = await listMonitors();
  await Promise.all(monitors.filter(isDue).map((m) => runMonitor(m.id)));
}

export function startMonitorScheduler(): void {
  setInterval(() => {
    checkDueMonitors().catch((err) => console.error('[monitor] scheduler error:', err));
  }, 15 * 60 * 1000);

  checkDueMonitors().catch(() => { /* silent on startup */ });
  console.log('[monitor] Scheduler started (checks every 15 min)');
}
