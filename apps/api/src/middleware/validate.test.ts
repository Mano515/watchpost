import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { validateUrl, validateDomain, validateEmail, validatePassword } from './validate';

function mockRes() {
  const res = { status: vi.fn(), json: vi.fn() } as unknown as Response;
  (res.status as ReturnType<typeof vi.fn>).mockReturnValue(res);
  return res;
}
function mockReq(body: Record<string, unknown>): Request {
  return { body } as unknown as Request;
}
const next: NextFunction = vi.fn();

describe('validateUrl', () => {
  it('calls next() for valid https URL', () => {
    const req = mockReq({ url: 'https://example.com' });
    validateUrl(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
  });

  it('calls next() for valid http URL', () => {
    const req = mockReq({ url: 'http://example.com' });
    validateUrl(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
  });

  it('returns 400 for missing url', () => {
    const res = mockRes();
    validateUrl(mockReq({}), res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 for non-http scheme', () => {
    const res = mockRes();
    validateUrl(mockReq({ url: 'ftp://example.com' }), res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 for plain string without scheme', () => {
    const res = mockRes();
    validateUrl(mockReq({ url: 'example.com' }), res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('validateDomain', () => {
  it('calls next() for valid domain', () => {
    const req = mockReq({ domain: 'example.com' });
    validateDomain(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
  });

  it('strips http:// prefix', () => {
    const req = mockReq({ domain: 'http://example.com' });
    validateDomain(req, mockRes(), next);
    expect(req.body.domain).toBe('example.com');
    expect(next).toHaveBeenCalled();
  });

  it('strips https:// and path', () => {
    const req = mockReq({ domain: 'https://example.com/path' });
    validateDomain(req, mockRes(), next);
    expect(req.body.domain).toBe('example.com');
  });

  it('returns 400 for missing domain', () => {
    const res = mockRes();
    validateDomain(mockReq({}), res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 for invalid domain', () => {
    const res = mockRes();
    validateDomain(mockReq({ domain: 'not a domain!' }), res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('validateEmail', () => {
  it('calls next() for valid email', () => {
    const req = mockReq({ email: 'user@example.com' });
    validateEmail(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
  });

  it('returns 400 for missing email', () => {
    const res = mockRes();
    validateEmail(mockReq({}), res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 for malformed email', () => {
    const res = mockRes();
    validateEmail(mockReq({ email: 'notanemail' }), res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 for email longer than 254 characters', () => {
    const res = mockRes();
    validateEmail(mockReq({ email: 'a'.repeat(250) + '@b.co' }), res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('validatePassword', () => {
  it('calls next() for valid password', () => {
    const req = mockReq({ password: 'correcthorsebatterystaple' });
    validatePassword(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
  });

  it('returns 400 for missing password', () => {
    const res = mockRes();
    validatePassword(mockReq({}), res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 for password over 128 chars', () => {
    const res = mockRes();
    validatePassword(mockReq({ password: 'x'.repeat(129) }), res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('accepts password of exactly 128 chars', () => {
    const req = mockReq({ password: 'x'.repeat(128) });
    validatePassword(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
  });
});
