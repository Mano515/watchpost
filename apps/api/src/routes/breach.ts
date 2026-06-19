import { Router, Request, Response } from 'express';
import { checkBreach } from '../services/breachService';

export const breachRoutes = Router();

breachRoutes.post('/', async (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };
  if (!email) return res.status(400).json({ error: 'email is required' });
  try {
    const result = await checkBreach(email);
    res.json(result);
  } catch (err) {
    res.status(502).json({ error: (err as Error).message });
  }
});
