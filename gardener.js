const gardener = require('./lib/gardener');

if (require.main === module) {
  gardener({
    author: 'Lukas Siemon',
    ci: ['circle'],
    dependabot: true
  }).catch(() => process.exit(1));
}
