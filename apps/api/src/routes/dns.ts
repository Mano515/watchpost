import { Router, Request, Response } from 'express';
import { dnsLookup } from '../services/dnsService';

export const dnsRoutes = Router();

dnsRoutes.post('/', async (req: Request, res: Response) => {
  const { domain } = req.body as { domain?: string };
  if (!domain) return res.status(400).json({ error: 'domain is required' });
  try {
    const result = await dnsLookup(domain);
    res.json(result);
  } catch (err) {
    res.status(502).json({ error: (err as Error).message });
  }
});
