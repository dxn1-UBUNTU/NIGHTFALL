import { makeFinding } from './findings.ts';
import type { Finding } from '../shared/types.ts';
const checks:[string,string,string][]=[['strict-transport-security','Missing HSTS','high'],['content-security-policy','Missing CSP','medium'],['x-content-type-options','Missing X-Content-Type-Options','low'],['referrer-policy','Missing Referrer-Policy','low'],['permissions-policy','Missing Permissions-Policy','low']];
export function analyzeHeaders(url:string,headers:Headers):Finding[]{const host=new URL(url).hostname;const out:Finding[]=[];for(const [h,title,severity] of checks){if(!headers.has(h))out.push(makeFinding({severity:severity as any,title,module:'headers',host,url,summary:`${h} is not present on the observed response.`,evidence:{header:h}}))}return out;}
