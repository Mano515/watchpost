import { Router } from 'express';
import { scanVulnerabilities } from '../services/vulnerabilityService';
import { validateUrl } from '../middleware/validate';

export const vulnRoutes = Router();

vulnRoutes.post('/', validateUrl, async (req, res) => {
  try {
    const result = await scanVulnerabilities(req.body.url as string);
    res.json(result);
  } catch (err) {
    res.status(502).json({ error: (err as Error).message });
  }
});
