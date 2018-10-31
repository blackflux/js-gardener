const gardener = require('./lib/gardener');

if (require.main === module) {
  gardener({
    author: 'Lukas Siemon',
    ci: ['circle'],
  }).catch(() => process.exit(1));
}
