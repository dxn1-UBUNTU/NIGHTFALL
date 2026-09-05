import type { UiState } from '../state.ts'; import { A } from '../ansi.ts';
export function render(s:UiState,w:number,h:number):string[]{return [A.bold+'Scan history'+A.reset,'',s.summary?`Last target: ${s.summary.target}`:'No scan history loaded in this session.','',A.dim+'Report bundles are written to '+s.settings.reportsDir+A.reset].slice(0,h)}
