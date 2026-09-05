import { A, pad } from './ansi.ts';
export function truncate(s:string,n:number){return s.length<=n?s:s.slice(0,Math.max(0,n-1))+'…'}
export function chip(label:string,value:string,tone='cyan'){const c=tone==='green'?A.green:tone==='yellow'?A.yellow:tone==='red'?A.red:tone==='magenta'?A.magenta:A.cyan;return c+' '+label+' '+A.reset+value}
export function meter(done:number,total:number,width:number):string{const ratio=total?Math.max(0,Math.min(1,done/total)):0;const fill=Math.round(ratio*width);return '['+'█'.repeat(fill)+'░'.repeat(Math.max(0,width-fill))+']'}
export function rule(w:number){return A.dim+'─'.repeat(w)+A.reset}
export function row(active:boolean,left:string,right:string,w:number){const r=truncate(right,Math.max(1,w-left.length-3));return (active?A.bg+A.white:'')+pad(' '+left,w-r.length-2)+r.padEnd(Math.max(0,r.length))+A.reset}
