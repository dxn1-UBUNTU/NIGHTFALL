import type { Settings } from '../config/model.ts';
import { normalizeUrl } from '../shared/urls.ts';
import type { RouteRecord } from '../shared/types.ts';
export function commonAuthRoutes(base:string,settings:Settings):string[]{
  const u=normalizeUrl(base); return settings.commonAuthRoutes.map(p=>new URL(p,u).toString());
}
export function likelyAuthUrl(url:string):number{
  return /(^|[/_.-])(login|signin|sign-in|auth|authorize|oauth|account|session|admin)([/_.?-]|$)/i.test(url)?60:0;
}
export function interestingRoute(url:string):number{
  let s=0; if(likelyAuthUrl(url))s+=60; if(/(?:admin|dashboard|api|graphql|swagger|openapi|debug|actuator)/i.test(url))s+=25; if(/[?&][^=]+=/i.test(url))s+=10; return s;
}
