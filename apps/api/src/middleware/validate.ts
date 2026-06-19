import { Request, Response, NextFunction } from 'express';

function isValidUrl(s: string): boolean {
  try { const u = new URL(s); return u.protocol === 'http:' || u.protocol === 'https:'; }
  catch { return false; }
}

function isValidDomain(s: string): boolean {
  return /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(s);
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;
}

export function validateUrl(req: Request, res: Response, next: NextFunction) {
  const { url } = req.body as { url?: string };
  if (!url || typeof url !== 'string') return res.status(400).json({ error: 'url is required' });
  if (!isValidUrl(url)) return res.status(400).json({ error: 'Invalid URL — must start with http:// or https://' });
  next();
}

export function validateDomain(req: Request, res: Response, next: NextFunction) {
  const { domain } = req.body as { domain?: string };
  if (!domain || typeof domain !== 'string') return res.status(400).json({ error: 'domain is required' });
  const clean = domain.replace(/^https?:\/\//, '').split('/')[0];
  if (!isValidDomain(clean)) return res.status(400).json({ error: 'Invalid domain name' });
  req.body.domain = clean;
  next();
}

export function validateEmail(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body as { email?: string };
  if (!email || typeof email !== 'string') return res.status(400).json({ error: 'email is required' });
  if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email address' });
  next();
}

export function validatePassword(req: Request, res: Response, next: NextFunction) {
  const { password } = req.body as { password?: string };
  if (!password || typeof password !== 'string') return res.status(400).json({ error: 'password is required' });
  if (password.length > 128) return res.status(400).json({ error: 'Password too long (max 128 characters)' });
  next();
}
