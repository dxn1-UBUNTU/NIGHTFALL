import type { Settings } from '../config/model.ts';
import { apexOf, isSubdomainOf } from '../shared/urls.ts';
import { runPool } from '../shared/collections.ts';
import { resolveHost } from '../http/dns.ts';

export async function certificateTransparency(apex: string, settings: Settings): Promise<string[]> {
  if (!settings.useCertificateTransparency) return [];
  const url=`https://crt.sh/?q=%25.${encodeURIComponent(apex)}&output=json`;
  try {
    const r=await fetch(url,{headers:{'user-agent':settings.userAgent}});
    if(!r.ok) return [];
    const rows=await r.json() as Array<{name_value?:string}>;
    const hosts=new Set<string>();
    for(const row of rows){ for(const n of (row.name_value??'').split(/\s+/)){ const h=n.toLowerCase().replace(/^\*\./,'').replace(/\.$/,''); if(isSubdomainOf(h,apex)) hosts.add(h); } }
    return [...hosts];
  } catch { return []; }
}
export async function dnsWordlist(apex:string, settings:Settings):Promise<string[]> {
  if(!settings.useDnsWordlist) return [];
  const found:string[]=[]; const candidates=settings.dnsWordlist.map(p=>`${p}.${apex}`);
  await runPool(candidates,Math.min(4,settings.concurrency),async host=>{ try{ const r=await resolveHost(host); if(r.ips.length||r.cname.length) found.push(host); }catch{} });
  return found;
}
export function apexFromAny(host:string):string{return apexOf(host);}
