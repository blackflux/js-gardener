const fs = require("fs");
const spawnSync = require('child_process').spawnSync;
const globSync = require("glob").sync;

module.exports.getTestFiles = folder => globSync(
  "test/**/test_*.js",
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
  "**/*.{yml,yaml}",
  {
    cwd: folder,
    ignore: [
      '**/node_modules/**'
    ],
    dot: true
  }
);

module.exports.getGitUrl = cwd => String(spawnSync('git', ['config', '--get', 'remote.origin.url'], { cwd }).stdout)
  .trim().slice(0, -4);

module.exports.readListFile = filePath => String(fs.readFileSync(filePath))
  .split("\n")
  .map(e => e.split("#", 1)[0].trim())
  .filter(e => e !== "");
