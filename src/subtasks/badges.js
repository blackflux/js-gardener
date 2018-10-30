const path = require('path');
const omit = require('lodash.omit');
const get = require('lodash.get');
const util = require('./../util');

// create missing badges
module.exports = (logger, cwd, config) => {
  const gitUrl = util.getGitUrl(cwd);
  const badgesTemplates = omit(
    util.readJsonFile(path.join(__dirname, '..', 'templates', 'badges.json')),
    get(config, 'skip', [])
  );
  const badges = Object.keys(badgesTemplates)
    .map(key => badgesTemplates[key])
    .reduce(
      (obj, badge) =>
        Object.assign(obj, {
          [badge
            .replace(/{{USER_NAME}}/g, gitUrl.split('/').reverse()[1])
            .replace(/{{REPO_NAME}}/g, gitUrl.split('/').reverse()[0])]: new RegExp(
            badge
              .replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')
              .replace(/\\{\\{USER_NAME\\}\\}/g, '[a-zA-Z0-9_-]+?')
              .replace(/\\{\\{REPO_NAME\\}\\}/g, '[a-zA-Z0-9_-]+?')
          )
        }),
      {}
    );
  const readmeFile = path.join(cwd, 'README.md');
  const readmeMd = util.readTextFile(readmeFile);
  const prepend = Object.keys(badges)
    .filter(badge => !readmeMd.match(badges[badge]))
    .join('\n');
  util.writeTextFile(readmeFile, `${prepend}${readmeMd}`);

  return Promise.resolve();
};
