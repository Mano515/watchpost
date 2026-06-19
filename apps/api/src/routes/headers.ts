import { Router, Request, Response } from 'express';
import { scanHeaders } from '../services/headerService';

export const headerRoutes = Router();

headerRoutes.post('/', async (req: Request, res: Response) => {
  const { url } = req.body as { url?: string };
  if (!url) return res.status(400).json({ error: 'url is required' });
  try {
    const result = await scanHeaders(url);
    res.json(result);
  } catch (err) {
    res.status(502).json({ error: `Failed to reach ${url}: ${(err as Error).message}` });
  }
});
