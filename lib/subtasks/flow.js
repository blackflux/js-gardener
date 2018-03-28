const childProcess = require('child_process');
const flow = require('flow-bin');

module.exports = (grunt, dir) => {
  const stdout = String(childProcess.execFileSync(flow, ['check'], { cwd: dir }));
  grunt.log.error([stdout]);
  return !stdout.search(/Found \d+ errors/);
};
