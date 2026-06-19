import { Router, Request, Response } from 'express';
import { checkPassword } from '../services/passwordService';

export const passwordRoutes = Router();

passwordRoutes.post('/', async (req: Request, res: Response) => {
  const { password } = req.body as { password?: string };
  if (!password) return res.status(400).json({ error: 'password is required' });
  try {
    const result = await checkPassword(password);
    res.json(result);
  } catch (err) {
    res.status(502).json({ error: (err as Error).message });
  }
});
