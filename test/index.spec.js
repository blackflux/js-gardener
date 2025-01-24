import path from 'path';
import fs from 'smart-fs';
import fancyLog from 'fancy-log';
import { expect } from 'chai';
import { describe } from 'node-tdd';
import gardener from '../src/index.js';

describe('Testing Integration', { useTmpDir: true, record: fancyLog, timeout: 30000 }, () => {
  let fsExistsSyncOriginal;

  before(() => {
    fsExistsSyncOriginal = fs.existsSync;
  });

  after(() => {
    fs.existsSync = fsExistsSyncOriginal;
  });

  it('Testing Ok', async ({ dir }) => {
    fs.smartWrite(path.join(dir, '.roboconfig.json'), {});
    fs.smartWrite(
      path.join(dir, '.eslintrc.json'),
      fs.smartRead(path.join(fs.dirname(import.meta.url), '..', '.eslintrc.json'))
    );
    fs.symlinkSync(
      path.join(fs.dirname(import.meta.url), '..', 'node_modules'),
      path.join(dir, 'node_modules')
    );
    fs.smartWrite(path.join(dir, 'package.json'), {
      name: 'pkg',
      type: 'module',
      dependencies: {
        '@babel/register': '1.0.0'
      },
      main: 'index.js'
    });
    expect(await gardener({ cwd: dir })).to.equal(undefined);
  });

  it('Testing Failure', async ({ dir, capture }) => {
    const savedCwd = process.cwd();
    process.chdir(dir);
    const e = await capture(() => gardener());
    expect(e.message).to.equal(`Configuration File missing: ${dir}/.roboconfig`);
    process.chdir(savedCwd);
  });

  it('Testing Not in Docker', ({ dir }) => {
    fs.existsSync = () => false;
    expect(() => gardener({ docker: true, cwd: dir })).to.throw('Please run in Docker');
  });

  it('Testing in Docker', ({ dir }) => {
    fs.existsSync = () => true;
    expect(() => gardener({
      docker: true,
      cwd: dir,
      skip: ['robo', 'structure', 'eslint', 'yamllint', 'depcheck', 'depused']
    })).to.not.throw('Please run in Docker');
  });
});
