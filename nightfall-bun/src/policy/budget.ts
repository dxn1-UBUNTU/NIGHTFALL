import { sleep } from '../shared/clock.ts';
export class RequestBudget {
  private nextAllowed = 0;
  private readonly perSecond: number;
  constructor(perSecond: number) { this.perSecond=perSecond; }
  async take(): Promise<void> {
    if (this.perSecond <= 0) return;
    const gap = 1000 / this.perSecond;
    const now = Date.now();
    const wait = Math.max(0, this.nextAllowed - now);
    if (wait) await sleep(wait);
    this.nextAllowed = Math.max(Date.now(), this.nextAllowed) + gap;
  }
}
