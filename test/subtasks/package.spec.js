const fs = require("fs");
const path = require("path");
const expect = require("chai").expect;
const tmp = require('tmp');
const pkg = require('../../src/subtasks/package');

tmp.setGracefulCleanup();

describe("Testing package", () => {
  let dir;
  beforeEach(() => {
    dir = tmp.dirSync({ keep: false, unsafeCleanup: true }).name;
  });

  it("Testing Copy", () => {
    fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify({
      repository: {
        type: "git",
        url: "git+https://github.com/blackflux/js-gardener.git"
      }
    }, null, 2));
    expect(() => pkg(null, dir, { license: "MIT" }))
      .to.throw("Repository Url required to start with https://");
  });
});
