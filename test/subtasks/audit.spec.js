const expect = require("chai").expect;
const audit = require('../../src/subtasks/audit');
const exec = require("../../src/util/exec");

const execRun = exec.run;
const logs = [];
const logger = {
  error: e => logs.push(e)
};

describe("Testing copy", () => {
  beforeEach(() => {
    logs.length = 0;
  });

  afterEach(() => {
    exec.run = execRun;
  });

  it("Testing Missing Npm", (done) => {
    exec.run = () => "false";
    audit(logger).then(() => {
      expect(logs).to.deep.equal(['NPM unavailable.']);
      done();
    }).catch(done.fail);
  });

  it("Testing Invalid Npm Version", (done) => {
    exec.run = (...args) => (args[0] === "npm --version" ? "5.6.0" : execRun(...args));
    audit(logger).then(() => {
      expect(logs).to.deep.equal(['Invalid NPM version (5.6.0).']);
      done();
    }).catch(done.fail);
  });

  it("Testing Audit Problem Found", (done) => {
    exec.run = (...args) => (args[0] === "npm audit --json" ? args[2](null, JSON.stringify({
      advisories: {
        577: {
          created: "2018-04-24T14:27:02.796Z",
          severity: "critical"
        }
      }
    })) : execRun(...args));
    audit(logger).then(done.fail).catch((e) => {
      expect(logs).to.deep.equal([]);
      expect(e.message).to.equal("Problem Detected. Run npm audit and fix.");
      done();
    });
  });
});
