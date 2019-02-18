const expect = require('chai').expect;
const tmp = require('tmp');
const copy = require('../../src/subtasks/copy');

const logs = [];
const logger = { info: e => logs.push(e) };

tmp.setGracefulCleanup();

describe('Testing copy', () => {
  beforeEach(() => {
    logs.length = 0;
  });

  it('Testing Copy', (done) => {
    const dir = tmp.dirSync({ keep: false, unsafeCleanup: true }).name;
    // all files are copied
    copy(logger, dir, {}).then(() => {
      expect(logs.length).to.equal(1);
      expect(logs[0].sort()).to.deep.equal([
        'README.md',
        'docker',
        'docker/Dockerfile',
        'dot.babelrc',
        'dot.circleci',
        'dot.circleci/config.yml',
        'dot.dependabot',
        'dot.dependabot/config.yml',
        'dot.editorconfig',
        'dot.flowconfig',
        'dot.gitignore',
        'dot.idea',
        'dot.idea/misc.xml',
        'dot.idea/jsLibraryMappings.xml',
        'dot.idea/jsLinters',
        'dot.idea/jsLinters/eslint.xml',
        'dot.idea/inspectionProfiles',
        'dot.idea/inspectionProfiles/Project_Default.xml',
        'dot.npmignore',
        'dot.travis.yml',
        'manage.sh',
        'src',
        'test',
        'test/mocha.opts'
      ].sort());
      // no files are copied
      copy(logger, dir, []).then(() => {
        expect(logs.length).to.equal(1);
        done();
      }).catch(done.fail);
    }).catch(done.fail);
  });
});
