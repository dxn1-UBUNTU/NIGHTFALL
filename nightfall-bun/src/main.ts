import { parseArgs } from './cli/args.ts'; import { runHeadless } from './cli/headless.ts'; import { loadSettings } from './config/store.ts'; import { runTui } from './ui/app.ts';
const args=parseArgs(process.argv.slice(2)); const settings=await loadSettings();
if(process.env.NIGHTFALL_AUTHORIZED_ROOTS){settings.authorizedRoots=process.env.NIGHTFALL_AUTHORIZED_ROOTS.split(',').map(x=>x.trim()).filter(Boolean)}
if(args.version){console.log('nightfall 0.4.1');process.exit(0)}
if(args.printConfig){console.log(JSON.stringify(settings,null,2));process.exit(0)}
if(args.url&&args.headless){await runHeadless(args.url,settings);process.exit(0)}
if(args.url&&!settings.authorizedRoots.length){console.error('Refusing to scan: add the target apex to authorizedRoots or set NIGHTFALL_AUTHORIZED_ROOTS.');process.exit(2)}
if(args.url)settings.authorizedRoots=[...settings.authorizedRoots,args.url];
await runTui(settings);
