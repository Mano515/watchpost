export function cleanDomain(raw: string): string {
  return raw.replace(/^https?:\/\//, '').split('/')[0].trim();
}
