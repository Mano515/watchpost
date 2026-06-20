import { Router, Request, Response } from 'express';
import { auditSite } from '../services/siteAuditService';

export const siteAuditRoutes = Router();

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
