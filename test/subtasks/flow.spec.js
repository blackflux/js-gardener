const tmp = require('tmp');
const expect = require("chai").expect;
const flow = require('../../src/subtasks/flow');

const logs = [];
const logger = { error: e => logs.push(e) };

tmp.setGracefulCleanup();

describe("Testing flow", () => {
  beforeEach(() => {
    logs.length = 0;
  });

  it("Testing missing .flowconfig", (done) => {
    const dir = tmp.dirSync({ keep: false, unsafeCleanup: true }).name;
    flow(logger, dir).catch(() => {
      expect(logs.length).to.equal(2);
      expect(logs[0]).to.contain("Could not find a .flowconfig");
      expect(logs[1]).to.equal("");
      done();
    });
  });
});
