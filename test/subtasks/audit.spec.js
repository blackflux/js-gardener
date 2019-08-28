const expect = require('chai').expect;
const chalk = require('chalk');
const { describe } = require('node-tdd');
const audit = require('../../src/subtasks/audit');
const exec = require('../../src/util/exec');


describe('Testing copy', { record: console }, () => {
  let execRun;
  before(() => {
    execRun = exec.run;
  });
  afterEach(() => {
    exec.run = execRun;
  });

  it('Testing Missing Npm', async ({ recorder }) => {
    exec.run = () => 'false';
    await audit(console);
    expect(recorder.get()).to.deep.equal(['NPM unavailable.']);
  });

  it('Testing Invalid Npm Version', async ({ recorder }) => {
    exec.run = (...args) => (args[0] === 'npm --version' ? '5.6.0' : execRun(...args));
    await audit(console);
    expect(recorder.get()).to.deep.equal(['Invalid NPM version (5.6.0).']);
  });

  it('Testing Audit Problem Found (Failure)', async ({ recorder }) => {
    exec.run = (...args) => (args[0] === 'npm audit --json' ? args[2](null, JSON.stringify({
      advisories: {
        577: {
          created: '2018-04-24T14:27:02.796Z',
          severity: 'critical'
        }
      }
    })) : execRun(...args));
    try {
      await audit(console);
    } catch (e) {
      expect(recorder.get()).to.deep.equal([
        `${chalk.yellow('Warning:')} Problem of Severity "critical" detected. ${chalk.red('Failure')}`
      ]);
      expect(e.message).to.equal('Failure. Fixing npm audit required.');
    }
  });

  it('Testing Audit Problem Found (Warning)', async ({ recorder }) => {
    exec.run = (...args) => (args[0] === 'npm audit --json' ? args[2](null, JSON.stringify({
      advisories: {
        577: {
          created: new Date().toISOString(),
          severity: 'low'
        }
      }
    })) : execRun(...args));
    await audit(console);
    expect(recorder.get()).to.deep.equal([
      `${chalk.yellow('Warning:')} Problem of Severity "low" detected. Failure in 364.00 days`
    ]);
  });
});
