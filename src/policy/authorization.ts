import { apexOf, hostOf, isSubdomainOf, normalizeUrl } from '../shared/urls.ts';
import type { Settings } from '../config/model.ts';

export function isAuthorizedRoot(url: string, settings: Settings): boolean {
  const host = hostOf(url);
  return settings.authorizedRoots.some(root => {
    const r = (() => { try { return hostOf(normalizeUrl(root)); } catch { return root.toLowerCase(); }})();
    return isSubdomainOf(host, apexOf(r));
  });
}
export function rootFor(url: string): string {
  return apexOf(hostOf(normalizeUrl(url)));
}
export function inScopeHost(host: string, apex: string): boolean { return isSubdomainOf(host, apex); }
export function canTestUrl(url: string, apex: string, settings: Settings): boolean {
  try {
    const u = normalizeUrl(url);
    if (!['http:','https:'].includes(u.protocol)) return false;
    if (!inScopeHost(u.hostname, apex)) return false;
    if (isPrivateHost(u.hostname) && !settings.privateNetworks) return false;
    return true;
  } catch { return false; }
}

function isPrivateHost(host: string): boolean {
  const h = host.toLowerCase();
  if (h === 'localhost' || h.endsWith('.local') || h === '::1') return true;
  const parts = h.split('.').map(Number);
  if (parts.length === 4 && parts.every(Number.isFinite)) {
    const [a,b] = parts;
    return a === 10 || a === 127 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
  }
  return false;
}
