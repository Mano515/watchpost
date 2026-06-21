import { Router, Request, Response } from 'express';
import { listMonitors, addMonitor, removeMonitor, runMonitor } from '../services/monitorService';

export const monitorRoutes = Router();

monitorRoutes.get('/', async (_req: Request, res: Response) => {
  res.json(await listMonitors());
});

monitorRoutes.post('/', async (req: Request, res: Response) => {
  const { domain, threshold, frequency, webhook, email } = req.body as {
    domain?: string; threshold?: number; frequency?: string; webhook?: string; email?: string;
  };

  if (!domain || typeof domain !== 'string') return res.status(400).json({ error: 'domain is required' });

  const clean = domain.replace(/^https?:\/\//, '').split('/')[0].trim();
  if (!clean) return res.status(400).json({ error: 'Invalid domain' });

  const th = Number(threshold ?? 80);
  if (isNaN(th) || th < 0 || th > 100) return res.status(400).json({ error: 'threshold must be 0-100' });

  const freq = frequency === 'weekly' ? 'weekly' : 'daily';

  const entry = await addMonitor({
    domain:    clean,
    threshold: th,
    frequency: freq,
    webhook:   webhook ?? undefined,
    email:     email ?? undefined,
  });
  res.status(201).json(entry);
});

monitorRoutes.delete('/:id', async (req: Request, res: Response) => {
  const removed = await removeMonitor(req.params['id'] as string);
  if (!removed) return res.status(404).json({ error: 'Monitor not found' });
  res.status(204).end();
});

monitorRoutes.post('/:id/run', async (req: Request, res: Response) => {
  const result = await runMonitor(req.params['id'] as string);
  if (!result) return res.status(404).json({ error: 'Monitor not found' });
  res.json(result);
});

// Returns whether SMTP is configured server-side (so frontend can warn if not)
monitorRoutes.get('/smtp-status', (_req: Request, res: Response) => {
  res.json({ smtpConfigured: !!process.env['SMTP_HOST'] });
});
