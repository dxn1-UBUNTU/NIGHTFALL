import type { HttpResponse } from '../http/client.ts';
import type { Settings } from '../config/model.ts';
import { extractCspHosts, extractResources } from '../http/html.ts';
import { apexOf, isSubdomainOf } from '../shared/urls.ts';
export function hostsFromResponse(resp:HttpResponse, apex:string):string[]{
  const set=new Set<string>();
  for(const u of [...extractResources(resp.body,new URL(resp.url)),...extractCspHosts(resp.headers)]){try{const h=new URL(u).hostname.toLowerCase();if(isSubdomainOf(h,apex))set.add(h)}catch{}}
  const location=resp.headers.get('location'); if(location)try{const h=new URL(location,resp.url).hostname.toLowerCase();if(isSubdomainOf(h,apex))set.add(h)}catch{}
  return [...set];
}
