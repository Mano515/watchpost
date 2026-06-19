import { Router, Request, Response } from 'express';
import { checkSsl } from '../services/sslService';

export const sslRoutes = Router();

sslRoutes.post('/', async (req: Request, res: Response) => {
  const { domain } = req.body as { domain?: string };
  if (!domain) return res.status(400).json({ error: 'domain is required' });
  try {
    const result = await checkSsl(domain);
    res.json(result);
  } catch (err) {
    res.status(502).json({ error: (err as Error).message });
  }
});
