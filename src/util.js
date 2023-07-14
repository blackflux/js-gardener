import fs from 'smart-fs';
import { sync as globSync } from 'glob';

export const getEsLintFiles = (folder, ignore) => globSync(
  '**/*.{js,json,md}',
  {
    cwd: folder,
    ignore,
    dot: true
  }
);

export const getTestFiles = (folder) => globSync(
  'test/**/*.spec.js',
  {
    cwd: folder,
    ignore: [
      '**/node_modules/**',
      '**/coverage/**'
    ],
    dot: true
  }
);

export const getYamlFiles = (folder) => globSync(
  '**/*.{yml,yaml}',
  {
    cwd: folder,
    ignore: [
      '**/node_modules/**'
    ],
    dot: true
  }
);

export const readTextFile = (filePath) => String(fs.readFileSync(filePath));

export const loadConfig = (cwd, name) => readTextFile(`${fs.dirname(import.meta.url)}/conf/${name}`)
  .split('\n')
  // add additional config options from project
  .concat(fs.existsSync(`${cwd}/${name}`) ? readTextFile(`${cwd}/${name}`).split('\n') : [])
  .map((e) => e.split('#', 1)[0].trim())
  .filter((e) => e !== '');
