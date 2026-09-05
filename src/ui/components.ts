import { A, pad } from './ansi.ts';
import type { UiState } from './state.ts'; import { labels, screens } from './state.ts';
export function clear(){process.stdout.write(A.clear+A.hide)}
export function size(){return{w:process.stdout.columns||120,h:process.stdout.rows||36}}
export function sidebar(s:UiState,w:number,h:number):string[]{const out:string[]=[];out.push(A.bold+A.cyan+' NIGHTFALL '+A.reset);out.push(A.dim+' Security Workstation '+A.reset);out.push(' '.repeat(w));screens.forEach((sc,i)=>{const active=sc===s.screen;out.push((active?A.bg+A.cyan:'')+pad(` ${active?'◆':' '} ${labels[i]}`,w-1)+A.reset)});out.push(' '.repeat(w));out.push(A.dim+pad(' v0.4.1 · Bun',w-1)+A.reset);out.push(A.dim+pad(s.scanning?' ● SCANNING':' ○ IDLE',w-1)+A.reset);while(out.length<h)out.push(' '.repeat(w));return out.slice(0,h)}
export function header(title:string,w:number){return A.bold+A.white+` ${title}`.padEnd(w)+A.reset}
export function footer(s:UiState,w:number){const hints=s.modal!=='none'?' Enter confirm · Esc cancel · Backspace delete ': ' Tab next · j/k navigate · Enter select · a target · d scan · ? help · q quit ';return A.dim+pad(hints,w)+A.reset}
export function panel(title:string,lines:string[],w:number,h:number):string[]{const top=`┌─ ${title} `+'─'.repeat(Math.max(0,w-4-title.length))+'┐';const bottom='└'+'─'.repeat(w-2)+'┘';const out=[top];for(let i=0;i<h-2;i++)out.push('│'+pad(lines[i]??'',w-2)+'│');out.push(bottom);return out}
export function split(left:string[],right:string[],total:number,gap=2):string[]{const lw=Math.floor((total-gap)/2),rw=total-gap-lw;const n=Math.max(left.length,right.length);const out:string[]=[];for(let i=0;i<n;i++)out.push(pad(left[i]??'',lw)+' '.repeat(gap)+pad(right[i]??'',rw));return out}
