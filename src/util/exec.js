import { execSync } from 'child_process';

export const run = (cmd, cwd) => execSync(cmd, { cwd }).toString('utf8').trim();
