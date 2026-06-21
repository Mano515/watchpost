import { Router, Request, Response } from 'express';
import { auditSite, streamAuditSite, getCachedAudit } from '../services/siteAuditService';

export const siteAuditRoutes = Router();

// POST /api/site-audit — regular (cached) scan
siteAuditRoutes.post('/', async (req: Request, res: Response) => {
  const { domain } = req.body as { domain?: string };
  if (!domain || typeof domain !== 'string') {
    return res.status(400).json({ error: 'domain is required' });
  }
  const clean = domain.replace(/^https?:\/\//, '').split('/')[0].trim();
  if (!clean) return res.status(400).json({ error: 'Invalid domain' });

  try {
    res.json(await auditSite(clean));
  } catch (err) {
    res.status(502).json({ error: (err as Error).message });
  }
});

// GET /api/site-audit/cached?domain=X — return last persisted result (no re-scan)
siteAuditRoutes.get('/cached', (req: Request, res: Response) => {
  const domain = (req.query['domain'] as string | undefined)?.replace(/^https?:\/\//, '').split('/')[0].trim();
  if (!domain) return res.status(400).json({ error: 'domain is required' });
  const result = getCachedAudit(domain);
  if (!result) return res.status(404).json({ error: 'No cached result for this domain' });
  res.json(result);
});

// GET /api/site-audit/stream?domain=X — SSE streaming scan with progress
siteAuditRoutes.get('/stream', async (req: Request, res: Response) => {
  const { domain } = req.query;
  if (!domain || typeof domain !== 'string') {
    return res.status(400).json({ error: 'domain is required' });
  }
  const clean = domain.replace(/^https?:\/\//, '').split('/')[0].trim();
  if (!clean) return res.status(400).json({ error: 'Invalid domain' });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering
  res.flushHeaders();

  let closed = false;
  req.on('close', () => { closed = true; });

  const emit = (event: string, data: unknown) => {
    if (!closed) res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const result = await streamAuditSite(clean, (step, pct) => {
      emit('progress', { step, pct });
    });
    emit('result', result);
  } catch (err) {
    emit('error', { error: (err as Error).message });
  }

  res.end();
});
