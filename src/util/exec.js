const { execSync } = require('child_process');

module.exports.run = (cmd, cwd) => execSync(cmd, { cwd }).toString('utf8').trim();
