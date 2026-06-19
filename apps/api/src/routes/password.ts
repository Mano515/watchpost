import { Router, Request, Response } from 'express';
import { checkPassword } from '../services/passwordService';
import { validatePassword } from '../middleware/validate';

export const passwordRoutes = Router();

passwordRoutes.post('/', validatePassword, async (req: Request, res: Response) => {
  try {
    res.json(await checkPassword(req.body.password as string));
  } catch (err) {
    res.status(502).json({ error: (err as Error).message });
  }
});
