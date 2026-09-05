export function normalizeWhitespace(s: string): string { return s.replace(/\s+/g, ' ').trim(); }
export function titleFromHtml(html: string): string | undefined {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) return undefined;
  return normalizeWhitespace(m[1].replace(/<[^>]+>/g, '')) || undefined;
}
export function decodeEntities(s: string): string {
  return s.replace(/&quot;/gi,'"').replace(/&#39;/gi,"'").replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&amp;/gi,'&');
}
