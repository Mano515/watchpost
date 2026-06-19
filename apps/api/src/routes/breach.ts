import { Router, Request, Response } from 'express';
import { checkBreach } from '../services/breachService';
import { validateEmail } from '../middleware/validate';

export const breachRoutes = Router();

breachRoutes.post('/', validateEmail, async (req: Request, res: Response) => {
  try {
    res.json(await checkBreach(req.body.email as string));
  } catch (err) {
    res.status(502).json({ error: (err as Error).message });
  }
});
