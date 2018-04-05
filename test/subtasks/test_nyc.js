const fs = require("fs");
const path = require("path");
const tmp = require('tmp');
const expect = require("chai").expect;
const nyc = require('../../lib/subtasks/nyc');

const logs = [];
const logger = { info: e => logs.push(e) };

tmp.setGracefulCleanup();

describe("Testing nyc", () => {
  beforeEach(() => {
    logs.length = 0;
  });

  it("Testing Test Failure", (done) => {
    const dir = tmp.dirSync({ keep: false, unsafeCleanup: true }).name;
    const testFile = "test_fail.js";
    fs.writeFileSync(path.join(dir, testFile), `it("Test Failure", () => {throw new Error();});`);
    nyc(logger, dir, [testFile], [], [], { reporter: [], wrap: false }).catch((err) => {
      expect(logs.length).to.equal(1);
      expect(logs[0]).to.contain("Pre-Require: ");
      expect(err.message).to.equal("Test Failure(s)");
      done();
    });
  });
});
