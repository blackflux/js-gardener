const { execSync, exec } = require('child_process');

module.exports.run = (cmd, cwd, cb = undefined) =>
  cb
    ? exec(cmd, { cwd }, cb)
    : execSync(cmd, { cwd })
        .toString('utf8')
        .trim();
