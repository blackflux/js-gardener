const fs = require('fs');
const path = require('path');
const tmp = require('tmp');
const expect = require("chai").expect;
const depcheck = require('../../lib/subtasks/depcheck');

const logs = [];
const logger = { error: e => logs.push(e) };

tmp.setGracefulCleanup();

describe("Testing depcheck", () => {
  beforeEach(() => {
    logs.length = 0;
  });

  it("Testing Not Installed", (done) => {
    const dir = tmp.dirSync({ keep: false, unsafeCleanup: true }).name;
    fs.writeFileSync(path.join(dir, "package.json"), '{"dependencies": {"mocha": "5.0.5"}}');
    depcheck(logger, dir).catch(() => {
      expect(logs.length).to.equal(2);
      expect(logs[0]).to.contain(" missing: mocha@5.0.5, required by ");
      expect(logs[1]).to.equal(undefined);
      done();
    });
  });
});
