import os from 'node:os';
import path from 'node:path';
export const configDir = path.join(os.homedir(), '.config', 'nightfall');
export const configFile = path.join(configDir, 'config.json');
