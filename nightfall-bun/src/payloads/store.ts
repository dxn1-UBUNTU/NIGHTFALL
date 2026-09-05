import fs from 'node:fs'; import path from 'node:path'; import type { Payload } from './model.ts';
export class PayloadStore {
 private readonly root:string;
 constructor(root=path.resolve('assets/payloads')){this.root=root}
 *iterate(family:string,limit:number):Generator<Payload>{ const dir=path.join(this.root,family); let files:string[]=[]; try{files=fs.readdirSync(dir).filter(f=>f.endsWith('.json')).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));}catch{return;} let count=0; for(const file of files){ if(limit>0&&count>=limit)break; let value:Payload; try{ value=JSON.parse(fs.readFileSync(path.join(dir,file),'utf8')) as Payload; }catch{continue;} if(!value.safe)continue; yield {...value,file:path.join(family,file)}; count++; } }
 count(family:string):number{try{return fs.readdirSync(path.join(this.root,family)).filter(f=>f.endsWith('.json')).length}catch{return 0}}
 families():string[]{try{return fs.readdirSync(this.root,{withFileTypes:true}).filter(x=>x.isDirectory()).map(x=>x.name)}catch{return[]}}
}
