import { now } from '../shared/clock.ts';
import type { Finding, Severity } from '../shared/types.ts';
export function makeFinding(input:{severity:Severity;title:string;module:string;host:string;url:string;summary:string;evidence?:Record<string,string>;probeId?:string;probeFile?:string}):Finding{
 return {id:`F-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`,firstSeen:now(),evidence:{},...input,evidence:input.evidence??{}};
}
