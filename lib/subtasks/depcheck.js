const checkDependencies = require('check-dependencies');

module.exports = (grunt, dir) => checkDependencies({
  packageManager: "npm",
  packageDir: dir,
  onlySpecified: false,
  install: false
}).then((output) => {
  if ((output.error !== null) && (output.error.length > 0)) {
    grunt.log.error(output.error);
  }
  return Promise.resolve(output.status === 0 && output.depsWereOk);
});
