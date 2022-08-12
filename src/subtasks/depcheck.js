import fs from 'smart-fs';
import path from 'path';
import childProcess from 'child_process';

export default (logger, dir) => (async () => {
  let success = true;
  if (success && fs.existsSync(path.join(dir, 'package-lock.json'))) {
    const data = childProcess
      .spawnSync('npm', ['ls', '--depth=0', '--parsable', '--json', '--no-update-notifier'], { cwd: dir });
    const [stdout, stderr] = [String(data.stdout), String(data.stderr)];
    success = stderr === '' && (stdout.problems || []).length === 0;
    if (!success) {
      logger.error(stdout);
      logger.error(stderr);
    }
  }
  if (success && fs.existsSync(path.join(dir, 'yarn.lock'))) {
    const data = childProcess
      .spawnSync('yarn', ['install', '--frozen-lockfile', '--silent', '--non-interactive'], { cwd: dir });
    const [stdout, stderr] = [String(data.stdout), String(data.stderr)];
    success = ['', 'null'].includes(stderr);
    if (!success) {
      logger.error(stdout);
      logger.error(stderr);
    }
  }
  if (!success) {
    throw new Error('depcheck failed');
  }
})();
