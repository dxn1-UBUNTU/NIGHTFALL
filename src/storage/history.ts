import fs from 'node:fs/promises'; export async function readHistory(path:string){try{return(await fs.readFile(path,'utf8')).split(/\r?\n/).filter(Boolean).map(JSON.parse)}catch{return[]}}
