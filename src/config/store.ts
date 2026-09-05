import fs from 'node:fs/promises';
import { configDir, configFile } from './path.ts';
import { defaults, type Settings } from './model.ts';

export async function loadSettings(): Promise<Settings> {
  try {
    const raw = JSON.parse(await fs.readFile(configFile, 'utf8'));
    return {...defaults(), ...raw};
  } catch {
    return defaults();
  }
}
export async function saveSettings(settings: Settings): Promise<void> {
  await fs.mkdir(configDir, {recursive:true});
  await fs.writeFile(configFile, JSON.stringify(settings, null, 2));
}
