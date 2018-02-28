const checkDependencies = require('check-dependencies');

module.exports = (grunt, dir) => checkDependencies({
  packageManager: "npm",
  packageDir: dir,
  onlySpecified: false,
  install: false
}).then((output) => {
  grunt.log.error(output.error);
  return Promise.resolve(output.status === 0 && output.depsWereOk);
});
