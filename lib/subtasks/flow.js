const childProcess = require('child_process');
const flow = require('flow-bin');

module.exports = (grunt, dir) => new Promise(resolve => childProcess
  .execFile(flow, ['check'], { cwd: dir }, (err, stdout) => {
    grunt.log.error([stdout]);
    resolve(!stdout.search(/Found \d+ errors/));
  }));
