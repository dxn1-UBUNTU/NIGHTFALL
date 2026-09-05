export const findingMarkdown=(f:any)=>`### ${String(f.severity).toUpperCase()} — ${f.title}\n\n${f.url}\n\n${f.summary}\n`;
