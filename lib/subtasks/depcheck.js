const util = require("./../util");

module.exports = (grunt, dir) => {
  const depInfo = util.getNpmDependencies(dir);

  grunt.log.error(depInfo[1]);
  grunt.log.error(depInfo[0].problems || []);

  return Promise.resolve(depInfo[1] === "" && (depInfo[0].problems || []).length === 0);
};
