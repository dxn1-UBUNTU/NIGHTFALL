import { RequestBudget } from '../policy/budget.ts';
import type { Settings } from '../config/model.ts';
import { titleFromHtml } from '../shared/text.ts';

export interface HttpResponse { url: string; status: number; headers: Headers; body: string; elapsedMs: number; contentType?: string; }
export class HttpClient {
  private readonly budget: RequestBudget;
  private readonly settings: Settings;
  constructor(settings: Settings) { this.settings = settings; this.budget = new RequestBudget(settings.requestPerSecond); }
  async get(url: string): Promise<HttpResponse> {
    await this.budget.take();
    const started = performance.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.settings.timeoutMs);
    try {
      const r = await fetch(url, {method:'GET', redirect:this.settings.followRedirects?'follow':'manual', headers:{'user-agent':this.settings.userAgent, accept:'text/html,application/xhtml+xml,application/json;q=0.8,*/*;q=0.5'}, signal:controller.signal});
      const buf = new Uint8Array(await r.arrayBuffer());
      const clipped = buf.byteLength > this.settings.maxBodyBytes ? buf.slice(0,this.settings.maxBodyBytes) : buf;
      return {url:r.url, status:r.status, headers:r.headers, body:new TextDecoder().decode(clipped), elapsedMs:Math.round(performance.now()-started), contentType:r.headers.get('content-type') ?? undefined};
    } finally { clearTimeout(timer); }
  }
}
export function responseTitle(resp: HttpResponse): string | undefined { return titleFromHtml(resp.body); }
