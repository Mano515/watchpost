import { Router, Request, Response } from 'express';
import { auditDomain } from '../services/domainService';
import { validateDomain } from '../middleware/validate';

export const domainRoutes = Router();

domainRoutes.post('/', validateDomain, async (req: Request, res: Response) => {
  try {
    res.json(await auditDomain(req.body.domain as string));
  } catch (err) {
    res.status(502).json({ error: (err as Error).message });
  }
});
