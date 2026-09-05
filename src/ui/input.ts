export function parseKey(buf:Buffer):string{
 const s=buf.toString('utf8'); if(s==='\x1b')return'ESC'; if(s==='\x7f')return'BACKSPACE'; if(s==='\r'||s==='\n')return'ENTER'; if(s==='\t')return'TAB'; if(s==='\x1b[A')return'UP';if(s==='\x1b[B')return'DOWN';if(s==='\x1b[C')return'RIGHT';if(s==='\x1b[D')return'LEFT';if(s==='\x1b[Z')return'SHIFT_TAB'; if(s.startsWith('\x1b'))return'ESCSEQ'; return s;
}
