import type { Settings } from '../config/model.ts'; import { HttpClient } from '../http/client.ts'; import { certificateTransparency,dnsWordlist } from '../discovery/subdomains.ts'; import { resolveHost } from '../http/dns.ts'; import { canonicalHostUrl, hostOf, apexOf, isSubdomainOf } from '../shared/urls.ts'; import { runPool, uniq } from '../shared/collections.ts'; import type { DiscoveryEvent, HostRecord, ScanSummary, RouteRecord, AuthSurface, Finding, ProbeResult, InputPoint } from '../shared/types.ts'; import { crawlHost } from '../discovery/crawler.ts';
import { robots } from '../discovery/robots.ts';
import { sitemap } from '../discovery/sitemap.ts'; import { probeCommonAuthRoutes } from '../discovery/auth.ts'; import { PayloadStore } from '../payloads/store.ts'; import { responseFindings, takeoverFindings } from '../security/registry.ts'; import { runReflection } from '../security/reflection.ts'; import { runSqlParser } from '../security/sqli.ts'; import { writeReports } from '../reporting/write.ts'; import { now } from '../shared/clock.ts';

export interface EngineData {hosts:HostRecord[];routes:RouteRecord[];auth:AuthSurface[];findings:Finding[];probes:ProbeResult[];inputs:InputPoint[];}

export class DiscoveryEngine {
 private readonly settings:Settings;
 private readonly emit:(e:DiscoveryEvent)=>void;
 constructor(settings:Settings, emit:(e:DiscoveryEvent)=>void){ this.settings=settings; this.emit=emit; }
 async scan(target:string):Promise<EngineData>{
  const started=now();const rootHost=hostOf(target);const apex=apexOf(rootHost);const http=new HttpClient(this.settings);const store=new PayloadStore();const data:EngineData={hosts:[],routes:[],auth:[],findings:[],probes:[],inputs:[]};
  this.emit({type:'phase',message:`Certificate Transparency: ${apex}`});
  const seeds=uniq([rootHost,...await certificateTransparency(apex,this.settings),...await dnsWordlist(apex,this.settings)]).filter(h=>isSubdomainOf(h,apex)).slice(0,this.settings.maxHosts);
  this.emit({type:'phase',message:`Queued ${seeds.length} hostname candidates`});
  const discovered=new Set<string>(seeds);let queue=[...seeds];
  while(queue.length&&data.hosts.length<this.settings.maxHosts){
   const batch=queue.splice(0,this.settings.maxHosts-data.hosts.length);const discoveredThisRound:string[]=[];
   await runPool(batch,this.settings.concurrency,async host=>{
    let dns;try{dns=await resolveHost(host)}catch{dns={host,ips:[],cname:[]}};
    const h:HostRecord={host,url:canonicalHostUrl(host),status:'unknown',technologies:[],ips:dns.ips,cname:dns.cname,discoveredBy:host===rootHost?['target']:['subdomain-discovery'],lastChecked:now()};
    if(!dns.ips.length&&!dns.cname.length){h.status='dead';data.hosts.push(h);this.emit({type:'host',host:h});return}
    try{const resp=await http.get(h.url);h.status='live';h.statusCode=resp.status;h.url=resp.url;h.title=this.title(resp.body);h.technologies=[];for(const f of responseFindings(resp.url,resp.headers,resp.body)){data.findings.push(f);this.emit({type:'finding',finding:f})} for(const f of await takeoverFindings(h,resp.body)){data.findings.push(f);this.emit({type:'finding',finding:f})}const extra=[...this.hostsFromHtml(resp.body,apex),...this.hostsFromCsp(resp.headers,apex),...this.redirectHost(resp.url,apex)];for(const x of extra)if(!discovered.has(x)){discovered.add(x);discoveredThisRound.push(x)}this.emit({type:'host',host:h});
      const crawl=await crawlHost(resp.url,apex,this.settings,http,(kind,payload)=>{if(kind==='route')this.emit({type:'route',route:payload});if(kind==='auth')this.emit({type:'auth',auth:payload});if(kind==='input')this.emit({type:'input',input:payload});if(kind==='log')this.emit({type:'log',message:String(payload)})});
      data.routes.push(...crawl.routes);data.inputs.push(...crawl.inputs);data.auth.push(...crawl.auth);for(const f of crawl.responses){for(const finding of responseFindings(f.url,f.headers,f.body)){data.findings.push(finding);this.emit({type:'finding',finding})}}
      for(const x of crawl.discoveredHosts)if(isSubdomainOf(x,apex)&&!discovered.has(x)){discovered.add(x);discoveredThisRound.push(x)}
      const robotSitemaps=await robots(resp.url,http); for(const sm of robotSitemaps){const urls=await sitemap(sm,http); for(const u of urls.slice(0,this.settings.maxRoutesPerHost)){try{const ru=new URL(u); if(isSubdomainOf(ru.hostname,apex)){const rr={url:ru.toString(),host:ru.hostname,depth:0,source:'sitemap' as const,parameters:[...ru.searchParams.keys()]}; data.routes.push(rr); this.emit({type:'route',route:rr}); if(ru.hostname!==host&&!discovered.has(ru.hostname)){discovered.add(ru.hostname);discoveredThisRound.push(ru.hostname)}}}catch{}}} const directSitemap=await sitemap(resp.url,http); for(const u of directSitemap.slice(0,this.settings.maxRoutesPerHost)){try{const ru=new URL(u); if(isSubdomainOf(ru.hostname,apex)){const rr={url:ru.toString(),host:ru.hostname,depth:0,source:'sitemap' as const,parameters:[...ru.searchParams.keys()]}; data.routes.push(rr); this.emit({type:'route',route:rr}); if(ru.hostname!==host&&!discovered.has(ru.hostname)){discovered.add(ru.hostname);discoveredThisRound.push(ru.hostname)}}}catch{}} const common=await probeCommonAuthRoutes(resp.url,apex,this.settings,http,a=>{data.auth.push(a);this.emit({type:'auth',auth:a})});void common;
      // Controlled canary testing on query inputs only; password fields are excluded by crawler mapping.
      const queryTargets=data.routes.filter(r=>r.host===host&&r.parameters.length).slice(-25);
      for(const route of queryTargets){for(const param of route.parameters.slice(0,3)){const x=await runReflection(route.url,param,apex,this.settings,http,store,p=>{data.probes.push(p);this.emit({type:'probe',probe:p})});for(const f of x){data.findings.push(f);this.emit({type:'finding',finding:f})}const s=await runSqlParser(route.url,param,apex,this.settings,http,store,p=>{data.probes.push(p);this.emit({type:'probe',probe:p})});for(const f of s){data.findings.push(f);this.emit({type:'finding',finding:f})}}}
    }catch(e){h.status='blocked';h.error=String(e);this.emit({type:'log',message:`${host}: ${String(e)}`});this.emit({type:'host',host:h})}
   });
   queue=uniq([...queue,...discoveredThisRound]).filter(h=>isSubdomainOf(h,apex)).slice(0,this.settings.maxHosts-data.hosts.length);
  }
  const finished=now();const summary:ScanSummary={target,startedAt:started,finishedAt:finished,hosts:data.hosts.length,liveHosts:data.hosts.filter(h=>h.status==='live').length,routes:data.routes.length,authSurfaces:data.auth.length,findings:data.findings.length,probes:data.probes.length};
  const report=await writeReports(this.settings.reportsDir,{summary,...data}); this.emit({type:'log',message:`Report JSON: ${report.json}`});this.emit({type:'log',message:`Report Markdown: ${report.markdown}`});this.emit({type:'done',done:summary});return data;
 }
 private hostsFromHtml(body:string,apex:string){const m=body.matchAll(/https?:\/\/([a-z0-9.-]+)(?=[/:"'\s])/gi);const out:string[]=[];for(const x of m){const h=x[1].toLowerCase();if(isSubdomainOf(h,apex))out.push(h)}return uniq(out)}
 private hostsFromCsp(headers:Headers,apex:string){const c=headers.get('content-security-policy')??'';const out:string[]=[];for(const x of c.matchAll(/https?:\/\/([^\s;]+)/gi)){const h=x[1].toLowerCase();if(isSubdomainOf(h,apex))out.push(h)}return uniq(out)}
 private redirectHost(url:string,apex:string){try{const h=new URL(url).hostname;return isSubdomainOf(h,apex)?[h]:[]}catch{return[]}}
 private title(body:string){const m=body.match(/<title[^>]*>([\s\S]*?)<\/title>/i);return m?m[1].replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim().slice(0,200):undefined}
}
