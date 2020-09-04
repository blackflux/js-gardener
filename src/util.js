const fs = require('fs');
const globSync = require('glob').sync;

module.exports.getEsLintFiles = (folder, ignore) => globSync(
  '**/*.{js,json,md}',
  {
    cwd: folder,
    ignore,
    dot: true
  }
);

module.exports.getTestFiles = (folder) => globSync(
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

module.exports.getYamlFiles = (folder) => globSync(
  '**/*.{yml,yaml}',
  {
    cwd: folder,
    ignore: [
      '**/node_modules/**'
    ],
    dot: true
  }
);

const readTextFile = (filePath) => String(fs.readFileSync(filePath));
module.exports.readTextFile = readTextFile;

module.exports.loadConfig = (cwd, name) => readTextFile(`${__dirname}/conf/${name}`).split('\n')
  // add additional config options from project
  .concat(fs.existsSync(`${cwd}/${name}`) ? readTextFile(`${cwd}/${name}`).split('\n') : [])
  .map((e) => e.split('#', 1)[0].trim())
  .filter((e) => e !== '');
