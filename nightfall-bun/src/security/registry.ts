import type { Finding, HostRecord, ProbeResult } from '../shared/types.ts';
import { analyzeHeaders } from './headers.ts'; import { analyzeCors } from './cors.ts'; import { analyzeTakeover } from './takeover.ts'; import { passiveInteresting } from './interesting.ts';
export function responseFindings(url:string,headers:Headers,body:string):Finding[]{return [...analyzeHeaders(url,headers),...analyzeCors(url,headers),...passiveInteresting(url,body,headers)];}
export async function takeoverFindings(host:HostRecord,body:string):Promise<Finding[]>{return analyzeTakeover(host,body);}
