//Finds root directory idependently from which file the execution started
import { readdir } from 'fs/promises';
import { readdirSync } from 'fs';
import { dirname } from 'path';

export async function findRootDir(directory: string = __dirname): Promise<string> {
  const ls = await readdir(directory);

  if (ls.includes('package.json'))
    return directory;
  else
    return findRootDir(dirname(directory));
}

export function findRootDirSync(directory: string = __dirname): string {
  const ls = readdirSync(directory);

  if (ls.includes('package.json'))
    return directory;
  else
    return findRootDirSync(dirname(directory));
}
