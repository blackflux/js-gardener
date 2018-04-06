const path = require('path');
const expect = require("chai").expect;
const util = require('./../src/util');

describe("Testing Util", () => {
  it("Testing loadConfig", () => {
    const result = util.loadConfig(path.join(__dirname, ".."), ".structignore");
    expect(result).to.deep.equal(['test/mock/test/test_sum.js']);
  });
});
