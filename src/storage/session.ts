import fs from 'node:fs/promises'; export async function appendJsonLine(path:string,value:unknown){await fs.appendFile(path,JSON.stringify(value)+'\n')}
