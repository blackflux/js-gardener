import path from 'path';
import fs from 'smart-fs';
import { sync } from 'glob';

const globSync = (wildcard, folder, ignore) => sync(
  wildcard,
  { cwd: folder, ignore, dot: true }
)
  .map((files) => files.split(path.sep).join(path.posix.sep));

export const getEsLintFiles = (folder, ignore) => globSync(
  '**/*.{js,json,md}',
  folder,
  ignore
);

export const getTestFiles = (folder) => globSync(
  'test/**/*.spec.js',
  folder,
  ['**/node_modules/**', '**/coverage/**']
);

export const getYamlFiles = (folder) => globSync(
  '**/*.{yml,yaml}',
  folder,
  ['**/node_modules/**']
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
