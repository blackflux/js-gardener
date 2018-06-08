const fs = require('fs');
const path = require('path');
const tmp = require('tmp');
const expect = require("chai").expect;
const depcheck = require('../../src/subtasks/depcheck');

const logs = [];
const logger = { error: e => logs.push(e) };

tmp.setGracefulCleanup();

describe("Testing depcheck", () => {
  beforeEach(() => {
    logs.length = 0;
  });

  // eslint-disable-next-line func-names
  it("Testing Not Installed", function (done) {
    this.timeout(30000);
    const dir = tmp.dirSync({ keep: false, unsafeCleanup: true }).name;
    fs.writeFileSync(path.join(dir, "package.json"), '{"dependencies": {"mocha": "5.0.5"}}');
    depcheck(logger, dir).catch(() => {
      expect(logs.length).to.equal(2);
      expect(logs[0]).to.contain(" missing: mocha@5.0.5, required by ");
      expect(logs[1]).to.equal(undefined);
      done();
    }).catch(done.fail);
  });

  // eslint-disable-next-line func-names
  it("Testing Ok", function (done) {
    this.timeout(30000);
    const dir = tmp.dirSync({ keep: false, unsafeCleanup: true }).name;
    fs.writeFileSync(path.join(dir, "package.json"), '{"dependencies": {}}');
    depcheck(logger, dir).then(() => {
      expect(logs.length).to.equal(0);
      done();
    }).catch(done.fail);
  });
});
