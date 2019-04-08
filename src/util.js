const fs = require('fs');
const spawnSync = require('child_process').spawnSync;
const globSync = require('glob').sync;
const gh = require('parse-github-url');

module.exports.getEsLintFiles = (folder, ignore) => globSync(
  '**/*.{js,json,md}',
  {
    cwd: folder,
    ignore,
    dot: true
  }
);

module.exports.getTestFiles = folder => globSync(
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

module.exports.getYamlFiles = folder => globSync(
  '**/*.{yml,yaml}',
  {
    cwd: folder,
    ignore: [
      '**/node_modules/**'
    ],
    dot: true
  }
);

const getRepoUrl = (cwd, remote) => {
  const url = String(spawnSync(
    'git',
    ['config', '--get', `remote.${remote}.url`],
    { cwd }
  ).stdout).trim();
  const parsed = gh(url);
  return parsed === null ? null : `https://${parsed.host}/${parsed.repo}`;
};

module.exports.getGitUrl = cwd => getRepoUrl(cwd, 'upstream') || getRepoUrl(cwd, 'origin');

module.exports.readListFile = filePath => String(fs.readFileSync(filePath, 'utf8'))
  .split('\n')
  .map(e => e.split('#', 1)[0].trim())
  .filter(e => e !== '');

module.exports.readTextFile = filePath => String(fs.readFileSync(filePath));

module.exports.readJsonFile = filePath => JSON.parse(this.readTextFile(filePath));

module.exports.writeTextFile = (filePath, content) => fs.writeFileSync(filePath, content);

module.exports.loadConfig = (cwd, name) => this.readTextFile(`${__dirname}/conf/${name}`).split('\n')
  // add additional config options from project
  .concat(fs.existsSync(`${cwd}/${name}`) ? this.readTextFile(`${cwd}/${name}`).split('\n') : [])
  .map(e => e.split('#', 1)[0].trim())
  .filter(e => e !== '');
