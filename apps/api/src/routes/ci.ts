import { Router, Request, Response } from 'express';
import { auditSite } from '../services/siteAuditService';
import { cleanDomain } from '../utils/cleanDomain';

export const ciRoutes = Router();

/**
 * GET /api/ci?domain=example.com&threshold=80
 * Returns HTTP 200 if score >= threshold, 412 if below.
 * Designed for use in GitHub Actions / CI pipelines.
 */
ciRoutes.get('/', async (req: Request, res: Response) => {
  const domain    = (req.query['domain'] as string | undefined) ? cleanDomain(req.query['domain'] as string) : undefined;
  const threshold = parseInt((req.query['threshold'] as string | undefined) ?? '80', 10);

  if (!domain) return res.status(400).json({ error: 'domain query parameter is required' });
  if (isNaN(threshold) || threshold < 0 || threshold > 100) {
    return res.status(400).json({ error: 'threshold must be 0-100' });
  }

  try {
    const audit = await auditSite(domain);
    const pass  = audit.overallScore >= threshold;
    const body  = {
      pass,
      domain,
      score:     audit.overallScore,
      grade:     audit.overallGrade,
      threshold,
      scannedAt: audit.scannedAt,
    };
    res.status(pass ? 200 : 412).json(body);
  } catch (err) {
    res.status(502).json({ error: (err as Error).message });
  }
});
