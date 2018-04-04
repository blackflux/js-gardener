const childProcess = require('child_process');
const flow = require('flow-bin');

module.exports = (logger, dir) => new Promise((resolve, reject) => childProcess
  .execFile(flow, ['check'], { cwd: dir }, (err, stdout) => {
    if (stdout !== "Found 0 errors\n") {
      logger.error(String(err));
      logger.error(stdout);
    }
    return !stdout.search(/Found \d+ errors/) ? resolve() : reject();
  }));
