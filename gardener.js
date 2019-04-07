const gardener = require('./lib/gardener');

if (require.main === module) {
  gardener({
    dependabot: true
  }).catch(() => process.exit(1));
}
