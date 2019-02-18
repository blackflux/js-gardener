const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const tmp = require('tmp');
const cfg = require('../../src/subtasks/configure');

tmp.setGracefulCleanup();

describe('Testing configure', () => {
  let dir;
  beforeEach(() => {
    dir = tmp.dirSync({ keep: false, unsafeCleanup: true }).name;
  });

  it('Testing Iml Rewrite', () => {
    const ideaDir = path.join(dir, '.idea');
    fs.mkdirSync(ideaDir);
    const imlFile = path.join(ideaDir, 'project.iml');
    fs.writeFileSync(imlFile, (
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<module type="WEB_MODULE" version="4">
  <component name="NewModuleRootManager">
    <content url="file://$MODULE_DIR$">
      <excludeFolder url="file://$MODULE_DIR$/.tmp"/>
      <excludeFolder url="file://$MODULE_DIR$/temp"/>
      <excludeFolder url="file://$MODULE_DIR$/tmp"/>
    </content>
    <orderEntry type="inheritedJdk"/>
    <orderEntry type="sourceFolder" forTests="false"/>
  </component>
</module>`
    ));
    cfg(null, dir, {
      skip: [
        '.babelrc',
        '.releaserc.json#npm',
        '.releaserc.json#dependabot',
        '.travis.yml',
        '.circleci/config.yml',
        '.gitignore',
        '.npmignore'
      ]
    });
    // for coverage
    cfg(null, dir, {
      skip: [
        '.babelrc',
        '.releaserc.json#npm',
        '.releaserc.json#dependabot',
        '.travis.yml',
        '.circleci/config.yml',
        '.gitignore',
        '.npmignore'
      ]
    });
    expect(String(fs.readFileSync(imlFile))).to.contain('<excludeFolder url="file://$MODULE_DIR$/coverage"/>');
  });
});
