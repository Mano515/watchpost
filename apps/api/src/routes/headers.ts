import { Router, Request, Response } from 'express';
import { scanHeaders } from '../services/headerService';
import { validateUrl } from '../middleware/validate';

export const headerRoutes = Router();

headerRoutes.post('/', validateUrl, async (req: Request, res: Response) => {
  try {
    res.json(await scanHeaders(req.body.url as string));
  } catch (err) {
    res.status(502).json({ error: (err as Error).message });
  }
});
