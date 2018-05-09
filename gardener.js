const gardener = require('./lib/gardener');

if (require.main === module) {
  gardener({
    author: "Lukas Siemon"
  }).catch(() => process.exit(1));
}
