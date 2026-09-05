import type { UiState } from '../state.ts'; import { A, pad } from '../ansi.ts'; import { chip, meter, truncate } from '../widgets.ts';
export function render(s:UiState,w:number,h:number):string[]{
  const total= s.probes.length; const signals=s.probes.filter(p=>p.matched).length; const live=s.hosts.filter(x=>x.status==='live').length; const crit=s.findings.filter(f=>f.severity==='critical').length; const high=s.findings.filter(f=>f.severity==='high').length;
  const out:string[]=[];
  out.push(A.bold+A.cyan+' NIGHTFALL '+A.reset+A.dim+'· surface intelligence'+A.reset,'');
  out.push(chip('STATUS',s.scanning?'SCANNING':'READY',s.scanning?'yellow':'green')+'  '+chip('HOSTS',String(live)+' live','green')+'  '+chip('FINDINGS',String(s.findings.length),crit||high?'red':'cyan')+'  '+chip('PROBES',String(total),'magenta'));
  out.push('');
  const bar=` ${meter(s.hosts.length,Math.max(1,s.settings.maxHosts),Math.min(32,Math.max(10,Math.floor(w/6))))} ${s.hosts.length}/${s.settings.maxHosts} hosts`; out.push(bar.slice(0,w));
  out.push('',A.bold+'TARGET'+A.reset,` ${s.targets[0]??'No target yet — press a to authorize one.'}`,'');
  out.push(A.bold+'SURFACE'+A.reset,` ${s.routes.length} routes  ·  ${s.auth.length} auth surfaces  ·  ${s.inputs.length} test points`);
  out.push(` ${signals} probe signals  ·  ${crit} critical  ·  ${high} high`,'');
  out.push(A.bold+'LATEST ACTIVITY'+A.reset); for(const l of s.logs.slice(-Math.max(1,h-12)))out.push(' '+truncate(l,Math.max(1,w-2)));
  return out.slice(0,h);
}
