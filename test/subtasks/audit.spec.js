const expect = require('chai').expect;
const chalk = require('chalk');
const desc = require('../util/desc');
const audit = require('../../src/subtasks/audit');
const exec = require('../../src/util/exec');

const execRun = exec.run;

desc('Testing copy', ({ it }) => {
  afterEach(() => {
    exec.run = execRun;
  });

  it('Testing Missing Npm', async ({ logger, logs }) => {
    exec.run = () => 'false';
    await audit(logger);
    expect(logs).to.deep.equal([['error', 'NPM unavailable.']]);
  });

  it('Testing Invalid Npm Version', async ({ logger, logs }) => {
    exec.run = (...args) => (args[0] === 'npm --version' ? '5.6.0' : execRun(...args));
    await audit(logger);
    expect(logs).to.deep.equal([['error', 'Invalid NPM version (5.6.0).']]);
  });

  it('Testing Audit Problem Found (Failure)', async ({ logger, logs }) => {
    exec.run = (...args) => (args[0] === 'npm audit --json' ? args[2](null, JSON.stringify({
      advisories: {
        577: {
          created: '2018-04-24T14:27:02.796Z',
          severity: 'critical'
        }
      }
    })) : execRun(...args));
    try {
      await audit(logger);
    } catch (e) {
      expect(logs).to.deep.equal([[
        'info',
        `${chalk.yellow('Warning:')} Problem of Severity "critical" detected. ${chalk.red('Failure')}`
      ]]);
      expect(e.message).to.equal('Failure. Fixing npm audit required.');
    }
  });

  it('Testing Audit Problem Found (Warning)', async ({ logger, logs }) => {
    exec.run = (...args) => (args[0] === 'npm audit --json' ? args[2](null, JSON.stringify({
      advisories: {
        577: {
          created: new Date().toISOString(),
          severity: 'low'
        }
      }
    })) : execRun(...args));
    await audit(logger);
    expect(logs).to.deep.equal([[
      'info',
      `${chalk.yellow('Warning:')} Problem of Severity "low" detected. Failure in 364.00 days`
    ]]);
  });
});
