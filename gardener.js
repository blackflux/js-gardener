const gardener = require('./lib/gardener');

if (require.main === module) {
  gardener().catch(() => process.exit(1));
}
