const gardener = require('./lib/gardener');

if (require.main === module) {
  gardener({
    ci: ['circle'],
    dependabot: true
  }).catch(() => process.exit(1));
}
