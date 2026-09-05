export function normalizeUrl(raw: string): URL {
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return new URL(withScheme);
}
export function hostOf(value: string | URL): string { return (typeof value === 'string' ? new URL(value) : value).hostname.toLowerCase(); }
export function apexOf(host: string): string {
  const parts = host.split('.').filter(Boolean);
  return parts.length >= 2 ? parts.slice(-2).join('.') : host;
}
export function isSubdomainOf(host: string, apex: string): boolean {
  const h = host.toLowerCase().replace(/\.$/, '');
  const a = apex.toLowerCase().replace(/\.$/, '');
  return h === a || h.endsWith(`.${a}`);
}
export function canonicalHostUrl(host: string): string { return `https://${host}/`; }
