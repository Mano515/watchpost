export async function httpGet(url: string, options?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } catch (err) {
    const name    = (err as Error).name;
    const message = (err as Error).message ?? '';
    if (name === 'AbortError' || message.includes('aborted')) {
      throw new Error('The site did not respond within 20 seconds (timeout).');
    }
    if (message.includes('ENOTFOUND') || message.includes('getaddrinfo')) {
      throw new Error('Domain not found — check the address and try again.');
    }
    if (message.includes('ECONNREFUSED')) {
      throw new Error('Connection refused — the site may be down or blocking requests.');
    }
    if (message.includes('ECONNRESET') || message.includes('socket hang up')) {
      throw new Error('The connection was reset by the server.');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
