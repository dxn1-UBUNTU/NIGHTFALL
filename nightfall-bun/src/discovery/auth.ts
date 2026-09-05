import type { Settings } from '../config/model.ts';
import type { AuthSurface, RouteRecord } from '../shared/types.ts';
import { commonAuthRoutes, likelyAuthUrl } from './routes.ts';
import { HttpClient } from '../http/client.ts';
import { canTestUrl } from '../policy/authorization.ts';
import { extractForms } from '../http/html.ts';
export async function probeCommonAuthRoutes(base:string,apex:string,settings:Settings,http:HttpClient,emit:(a:AuthSurface)=>void):Promise<AuthSurface[]>{
  const hits:AuthSurface[]=[]; const seen=new Set<string>();
  for(const url of commonAuthRoutes(base,settings)){if(seen.has(url)||!canTestUrl(url,apex,settings))continue;seen.add(url);try{const r=await http.get(url);if(r.status>=400)continue;const forms=extractForms(r.body,r.url);const score=likelyAuthUrl(r.url);if(score>0||forms.some(f=>f.auth)){if(forms.some(f=>f.auth)){for(const f of forms)if(f.auth){f.auth.method=f.method;hits.push(f.auth);emit(f.auth)}}else{const a:AuthSurface={url:r.url,score,reason:['route matched authentication heuristic'],passwordFields:[],identityFields:[],csrfLikeFields:[]};hits.push(a);emit(a)}}}catch{}}
  return hits;
}
