const gardener = require('./lib/gardener');

if (require.main === module) {
  gardener({ eslint: { rules: { "flow-enforce": 0 } } }).catch(() => process.exit(1));
}
