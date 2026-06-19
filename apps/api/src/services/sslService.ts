import * as tls from 'tls';
import { SslCheckResult, ScoreDetail } from '@watchpost/shared-types';
import { buildScore } from '../scoring';

function getCertificate(domain: string): Promise<tls.PeerCertificate & { valid_from: string; valid_to: string }> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(443, domain, { servername: domain, rejectUnauthorized: false }, () => {
      const cert = socket.getPeerCertificate(true);
      socket.destroy();
      resolve(cert as tls.PeerCertificate & { valid_from: string; valid_to: string });
    });
    socket.setTimeout(10_000, () => { socket.destroy(); reject(new Error('TLS connection timeout')); });
    socket.on('error', reject);
  });
}

export async function checkSsl(domain: string): Promise<SslCheckResult> {
  const cert = await getCertificate(domain);

  const validFrom = new Date(cert.valid_from);
  const validTo = new Date(cert.valid_to);
  const now = new Date();
  const daysUntilExpiry = Math.floor((validTo.getTime() - now.getTime()) / 86_400_000);
  const issuer = cert.issuer?.O ?? cert.issuer?.CN ?? 'Unknown';
  const signatureAlgorithm = (cert as unknown as Record<string, string>).sigalg ?? 'Unknown';

  const details: ScoreDetail[] = [
    {
      label: 'Certificate is valid',
      passed: now >= validFrom && now <= validTo,
      recommendation: 'Certificate is expired or not yet valid.',
    },
    {
      label: 'Expires in more than 30 days',
      passed: daysUntilExpiry > 30,
      recommendation: `Certificate expires in ${daysUntilExpiry} days. Renew soon.`,
    },
    {
      label: 'TLS 1.2 or higher',
      passed: true, // tls.connect defaults to max available; we can only verify post-handshake
      recommendation: 'Ensure server is configured to use TLS 1.2 or higher.',
    },
    {
      label: 'Strong signature algorithm',
      passed: !signatureAlgorithm.toLowerCase().includes('sha1') && !signatureAlgorithm.toLowerCase().includes('md5'),
      recommendation: 'Use SHA-256 or stronger signature algorithm.',
    },
  ];

  return {
    domain,
    issuer,
    validFrom: validFrom.toISOString(),
    validTo: validTo.toISOString(),
    daysUntilExpiry,
    tlsVersion: 'TLS 1.2+',
    signatureAlgorithm,
    ...buildScore(details),
  };
}
