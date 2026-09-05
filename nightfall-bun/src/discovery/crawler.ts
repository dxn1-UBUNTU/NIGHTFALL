import type { Settings } from '../config/model.ts';
import { HttpClient, type HttpResponse } from '../http/client.ts';
import { canTestUrl } from '../policy/authorization.ts';
import { extractAnchors, extractForms, extractResources, routeRecord } from '../http/html.ts';
import { extractJsRoutes } from './js-routes.ts';
import { uniq } from '../shared/collections.ts';
import type { AuthSurface, InputPoint, RouteRecord } from '../shared/types.ts';

export interface CrawlOutput { routes:RouteRecord[]; inputs:InputPoint[]; auth:AuthSurface[]; responses:HttpResponse[]; discoveredHosts:string[]; }
export async function crawlHost(start:string, apex:string, settings:Settings, http:HttpClient, emit:(kind:'route'|'auth'|'input'|'log',payload:any)=>void):Promise<CrawlOutput>{
  const queue:Array<{url:string,depth:number,source:RouteRecord['source']}>=[{url:start,depth:0,source:'crawl'}]; const seen=new Set<string>(); const routes:RouteRecord[]=[]; const inputs:InputPoint[]=[]; const auth:AuthSurface[]=[]; const responses:HttpResponse[]=[]; const discoveredHosts:string[]=[];
  while(queue.length && routes.length<settings.maxRoutesPerHost){
    const item=queue.shift()!; let u:URL; try{u=new URL(item.url)}catch{continue}
    if(seen.has(u.toString()))continue; seen.add(u.toString()); if(u.protocol!=='https:'&&u.protocol!=='http:')continue; if(!canTestUrl(u.toString(),apex,settings))continue;
    let resp:HttpResponse; try{resp=await http.get(u.toString())}catch(e){emit('log',`request failed ${u}: ${String(e)}`);continue}
    responses.push(resp); const route=routeRecord(resp.url,item.depth,item.source); route.status=resp.status; route.contentType=resp.contentType; routes.push(route); emit('route',route);
    const forms=extractForms(resp.body,resp.url); for(const form of forms){for(const input of form.inputs){inputs.push(input);emit('input',input)} if(form.auth){form.auth.method=form.method; auth.push(form.auth);emit('auth',form.auth)}} for(const clue of extractJsRoutes(resp.body,new URL(resp.url),apex)){const jr=routeRecord(clue.url,item.depth+1,'asset'); routes.push(jr); emit('route',jr); if(item.depth<settings.maxDepth) queue.push({url:clue.url,depth:item.depth+1,source:'asset'}); if(clue.authLike && !auth.some(a=>a.url===clue.url)){const candidate:AuthSurface={url:clue.url,score:clue.score,reason:['authentication-like route referenced in page script'],passwordFields:[],identityFields:[],csrfLikeFields:[]}; auth.push(candidate);emit('auth',candidate)}} if(!forms.some(f=>f.auth) && /(^|[/_.-])(login|signin|sign-in|auth|authorize|oauth|account|session|admin)([/_.?-]|$)/i.test(resp.url)){const candidate:AuthSurface={url:resp.url,score:60,reason:['URL matched authentication route heuristic'],passwordFields:[],identityFields:[],csrfLikeFields:[]}; auth.push(candidate); emit('auth',candidate)}
    const base=new URL(resp.url); for(const link of extractAnchors(resp.body,base)){
      try{const lu=new URL(link); if(!canTestUrl(lu.toString(),apex,settings)) {if(lu.hostname.endsWith(`.${apex}`))discoveredHosts.push(lu.hostname); continue;} if(lu.hostname!==base.hostname){discoveredHosts.push(lu.hostname);continue;} if(item.depth<settings.maxDepth)queue.push({url:lu.toString().split('#')[0],depth:item.depth+1,source:'crawl'});}catch{}
    }
    for(const resource of extractResources(resp.body,base)){try{const ru=new URL(resource); if(ru.hostname!==base.hostname&&ru.hostname.endsWith(`.${apex}`))discoveredHosts.push(ru.hostname)}catch{}}
  }
  return {routes,inputs,auth,responses,discoveredHosts:uniq(discoveredHosts)};
}
