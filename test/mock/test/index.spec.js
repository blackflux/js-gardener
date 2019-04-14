const expect = require('chai').expect;
const sum = require('../src/index');

describe('Testing Module', () => {
  it('Testing Addition', () => {
    expect(sum(3, 6)).to.equal(9);
  });
});
