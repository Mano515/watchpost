import { describe, it, expect } from 'vitest';
import { parseSpfPolicy, parseDmarcPolicy } from './domainService';

describe('parseSpfPolicy', () => {
  it('returns "fail" for -all (strict)', () => {
    expect(parseSpfPolicy('v=spf1 include:_spf.google.com -all')).toBe('fail');
  });

  it('returns "softfail" for ~all', () => {
    expect(parseSpfPolicy('v=spf1 include:mailservice.com ~all')).toBe('softfail');
  });

  it('returns "neutral" for ?all', () => {
    expect(parseSpfPolicy('v=spf1 ?all')).toBe('neutral');
  });

  it('returns "pass" for +all (permissive — bad)', () => {
    expect(parseSpfPolicy('v=spf1 +all')).toBe('pass');
  });

  it('returns "all" when no mechanism is present', () => {
    expect(parseSpfPolicy('v=spf1 include:example.com')).toBe('all');
  });
});

describe('parseDmarcPolicy', () => {
  it('returns "reject" for p=reject', () => {
    expect(parseDmarcPolicy('v=DMARC1; p=reject; rua=mailto:admin@example.com')).toBe('reject');
  });

  it('returns "quarantine" for p=quarantine', () => {
    expect(parseDmarcPolicy('v=DMARC1; p=quarantine')).toBe('quarantine');
  });

  it('returns "none" for p=none (monitoring only)', () => {
    expect(parseDmarcPolicy('v=DMARC1; p=none')).toBe('none');
  });

  it('defaults to "none" when p= is missing', () => {
    expect(parseDmarcPolicy('v=DMARC1')).toBe('none');
  });

  it('is case-insensitive for the policy value', () => {
    expect(parseDmarcPolicy('v=DMARC1; P=REJECT')).toBe('reject');
    expect(parseDmarcPolicy('v=DMARC1; p=Quarantine')).toBe('quarantine');
  });
});
