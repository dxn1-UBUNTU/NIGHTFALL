export function domXssSinks(body:string){return [/innerHTML/i,/document\.write/i,/insertAdjacentHTML/i,/eval\(/i,/new Function/i].filter(re=>re.test(body)).map(String)}
