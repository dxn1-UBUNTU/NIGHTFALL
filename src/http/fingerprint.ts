export interface Fingerprint { name: string; category: 'cdn'|'waf'|'platform'|'framework'|'service'; evidence: string; }
const markers: Array<[string, RegExp, Fingerprint['category']]> = [
  ['Cloudflare', /server:\s*cloudflare|__cf_bm|cf-ray/i, 'cdn'],
  ['Akamai', /akamai|x-akamai/i, 'cdn'],
  ['Fastly', /fastly|x-served-by/i, 'cdn'],
  ['Vercel', /x-vercel|vercel/i, 'platform'],
  ['Netlify', /netlify/i, 'platform'],
  ['nginx', /server:\s*nginx/i, 'platform'],
  ['WordPress', /wp-content\/|wp-json/i, 'framework'],
  ['Next.js', /__next_data__|_next\//i, 'framework'],
  ['Django', /csrftoken|django/i, 'framework'],
  ['Rails', /x-runtime|rails/i, 'framework'],
];
export function fingerprints(headers: Headers, body: string): Fingerprint[] {
  const hay = `${[...headers.entries()].map(([k,v])=>`${k}:${v}`).join('\n')}\n${body.slice(0,200000)}`;
  return markers.filter(([,re])=>re.test(hay)).map(([name,,category])=>({name,category,evidence:name}));
}
