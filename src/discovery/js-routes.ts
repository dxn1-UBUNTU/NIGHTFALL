import { isSubdomainOf } from '../shared/urls.ts';

export interface JsRouteClue { url: string; authLike: boolean; score: number; }
const endpointLiteral = /(?:['"`])((?:https?:\/\/)?\/[^'"`\s]{1,180})(?:['"`])/g;
const authWord = /(login|signin|sign-in|auth|oauth|authorize|account|session|admin|dashboard)/i;

export function extractJsRoutes(body: string, page: URL, apex: string): JsRouteClue[] {
  const out = new Map<string, JsRouteClue>();
  for (const m of body.matchAll(endpointLiteral)) {
    let raw=m[1];
    if (!raw.startsWith('/')) continue;
    try {
      const u=new URL(raw,page);
      if (!isSubdomainOf(u.hostname,apex) || u.hostname!==page.hostname) continue;
      const authLike=authWord.test(raw);
      const score=authLike?70:20;
      out.set(u.toString().split('#')[0],{url:u.toString().split('#')[0],authLike,score});
    } catch {}
  }
  return [...out.values()].slice(0,60);
}
