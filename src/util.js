import path from 'path';
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

export const loadConfig = (cwd, name) => {
  const configFilePathBase = path.join(fs.dirname(import.meta.url), 'conf', name);
  const configFilePath = path.join(cwd, name);

  const lines = fs.smartRead(configFilePathBase);
  if (fs.existsSync(configFilePath)) {
    lines.push(...fs.smartRead(configFilePath));
  }

  return lines
    .map((e) => e.split('#', 1)[0].trim())
    .filter((e) => e !== '');
};
