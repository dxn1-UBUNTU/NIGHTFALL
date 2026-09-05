import { decodeEntities } from '../shared/text.ts';
import type { AuthSurface, FieldDescriptor, InputPoint, RouteRecord } from '../shared/types.ts';

export interface FormDescriptor { action: string; method: string; fields: FieldDescriptor[]; inputs: InputPoint[]; auth?: AuthSurface; }
function attrs(tag: string): Record<string,string> {
  const out: Record<string,string> = {};
  for (const m of tag.matchAll(/([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
    const key=m[1].toLowerCase(); out[key]=decodeEntities(m[2]??m[3]??m[4]??'');
  }
  return out;
}
export function extractAnchors(html: string, base: URL): string[] {
  const urls:string[]=[];
  for (const m of html.matchAll(/<a\b[^>]*?href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
    const raw=decodeEntities(m[1]??m[2]??m[3]??'');
    try { urls.push(new URL(raw, base).toString()); } catch {}
  }
  return urls;
}
export function extractResources(html: string, base: URL): string[] {
  const out:string[]=[];
  for (const m of html.matchAll(/<(?:script|img|link|source|iframe)\b[^>]*?(?:src|href)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
    try { out.push(new URL(decodeEntities(m[1]??m[2]??m[3]??''), base).toString()); } catch {}
  }
  return out;
}
export function extractCspHosts(headers: Headers): string[] {
  const csp=headers.get('content-security-policy')??''; const out:string[]=[];
  for (const token of csp.split(/\s+/)) { if (/^https?:\/\//i.test(token)) { try{out.push(new URL(token).hostname)}catch{} } }
  return out;
}
export function extractForms(html: string, pageUrl: string): FormDescriptor[] {
  const base=new URL(pageUrl); const forms:FormDescriptor[]=[];
  for (const fm of html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)) {
    const a=attrs(fm[1]); const action=new URL(a.action||pageUrl,base).toString(); const method=(a.method||'GET').toUpperCase();
    const fields:FieldDescriptor[]=[]; const inputs:InputPoint[]=[]; const body=fm[2];
    let index=0;
    for (const im of body.matchAll(/<input\b([^>]*)>/gi)) {
      const ia=attrs(im[1]); const type=(ia.type||'text').toLowerCase(); const selector=ia.id?`#${cssEscape(ia.id)}`:ia.name?`[name="${cssEscape(ia.name)}"]`:`input:nth-of-type(${++index})`;
      const field:FieldDescriptor={name:ia.name||undefined,id:ia.id||undefined,type,autocomplete:ia.autocomplete||undefined,selector}; fields.push(field);
      if (!['hidden','submit','button','reset','file','image','password'].includes(type)) inputs.push({pageUrl,kind:'form',name:ia.name||`input-${index}`,method,action,selector,inputType:type,password:false});
      if (type==='password') inputs.push({pageUrl,kind:'form',name:ia.name||`password-${index}`,method,action,selector,inputType:type,password:true});
    }
    for (const tm of body.matchAll(/<textarea\b([^>]*)>/gi)) { const ta=attrs(tm[1]); const selector=ta.id?`#${cssEscape(ta.id)}`:ta.name?`[name="${cssEscape(ta.name)}"]`:`textarea:nth-of-type(${++index})`; inputs.push({pageUrl,kind:'form',name:ta.name||`textarea-${index}`,method,action,selector,inputType:'textarea',password:false}); fields.push({name:ta.name||undefined,id:ta.id||undefined,type:'textarea',selector}); }
    const auth=classifyAuth(pageUrl,action,fields,body);
    forms.push({action,method,fields,inputs,auth:auth.score>=45?auth:undefined});
  }
  return forms;
}
function classifyAuth(pageUrl:string, action:string, fields:FieldDescriptor[], body:string):AuthSurface {
  const hay=`${pageUrl} ${action} ${body}`.toLowerCase(); let score=0; const reason:string[]=[];
  const passwords=fields.filter(f=>f.type==='password');
  const identity=fields.filter(f=>['email','username','user','login'].some(k=>`${f.name} ${f.id} ${f.autocomplete}`.toLowerCase().includes(k)));
  const csrf=fields.filter(f=>f.type==='hidden' && ['csrf','xsrf','token','nonce'].some(k=>`${f.name} ${f.id}`.toLowerCase().includes(k)));
  if(passwords.length){score+=55;reason.push('password input present');}
  if(identity.length){score+=20;reason.push('identity field present');}
  if(/\blog[- ]?in\b|sign[ -]?in|authenticate|oauth|account/i.test(hay)){score+=20;reason.push('authentication language');}
  if(csrf.length){score+=5;reason.push('token-like hidden field');}
  return {url:pageUrl,score,reason,method:undefined,action,passwordFields:passwords,identityFields:identity,csrfLikeFields:csrf};
}
function cssEscape(v:string):string { return v.replace(/([\"'\\])/g,'\\$1'); }
export function routeRecord(url:string, depth:number, source:RouteRecord['source']):RouteRecord {
  const u=new URL(url); const params=[...u.searchParams.keys()]; return {url,host:u.hostname,depth,source,parameters:params};
}
