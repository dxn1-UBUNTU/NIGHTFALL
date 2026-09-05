import type { UiState } from '../state.ts';
import { A, pad } from '../ansi.ts';

export function render(s: UiState, w: number, h: number): string[] {
  const out = [A.bold + 'Test points' + A.reset, '', A.dim + 'TYPE'.padEnd(9) + 'FIELD'.padEnd(28) + 'STATE'.padEnd(12) + 'SELECTOR / DESTINATION' + A.reset];
  for (const p of s.inputs.slice(-Math.max(1, h - 5)).reverse()) {
    const state = p.password ? 'LOCKED' : 'TESTABLE';
    const dest = p.action ?? p.pageUrl;
    out.push(pad(p.kind.toUpperCase(), 9) + pad(p.name, 28) + pad(state, 12) + ((p.selector ?? '-') + ' ' + dest).slice(0, Math.max(1, w - 49)));
  }
  if (!s.inputs.length) out.push(A.dim + 'No form/query test points discovered yet.' + A.reset);
  out.push('', A.dim + 'LOCKED = password input: mapped only, never auto-filled or probed.' + A.reset);
  return out.slice(0, h);
}
