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
