import type { UiState } from '../state.ts'; import { A } from '../ansi.ts';
export function render(s:UiState,w:number,h:number):string[]{return [A.bold+'Live event stream'+A.reset,'',...s.logs.slice(-Math.max(1,h-3))].slice(0,h)}
