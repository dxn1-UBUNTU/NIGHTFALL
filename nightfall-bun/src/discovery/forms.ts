import { extractForms } from '../http/html.ts'; export function formInputs(html:string,url:string){return extractForms(html,url).flatMap(x=>x.inputs)}
