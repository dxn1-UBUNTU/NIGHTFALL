import dns from 'node:dns/promises';
export interface DnsResult { host: string; ips: string[]; cname: string[]; }
export async function resolveHost(host: string): Promise<DnsResult> {
  const [a, aaaa, cname] = await Promise.allSettled([dns.resolve4(host), dns.resolve6(host), dns.resolveCname(host)]);
  const ips = [...(a.status==='fulfilled'?a.value:[]), ...(aaaa.status==='fulfilled'?aaaa.value:[])];
  const cn = cname.status==='fulfilled'?cname.value:[];
  return {host, ips, cname:cn};
}
export async function isResolvable(host: string): Promise<boolean> {
  try { const r = await resolveHost(host); return r.ips.length > 0 || r.cname.length > 0; } catch { return false; }
}
