const gardener = require('./src/index');

if (require.main === module) {
  gardener().catch(() => process.exit(1));
}
