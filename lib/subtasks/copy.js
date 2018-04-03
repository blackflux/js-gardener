const fs = require('fs-extra');
const path = require("path");
const globSync = require("glob").sync;
const util = require("./../util");

// create folder and dirs, return created
module.exports = (logger, targetFolder) => {
  const fromFolder = path.join(__dirname, "..", "templates", "files");
  const created = [];
  globSync("**/*", { cwd: fromFolder, dot: true })
    .concat(util.readJsonFile(path.join(__dirname, "..", "templates", "folders.json")))
    .map(f => [
      f,
      path.join(fromFolder, f),
      path.join(targetFolder, f.replace(/^(.*?[/\\])?dot(\.[^/\\]*?)$/, '$1$2'))
    ])
    .forEach(([relPath, fromFile, toFile]) => {
      if (!fs.existsSync(toFile)) {
        if (fs.existsSync(fromFile) && fs.lstatSync(fromFile).isFile()) {
          fs.copySync(fromFile, toFile);
        } else {
          fs.mkdirSync(toFile);
        }
        created.push(relPath);
      }
    });
  if (created.length !== 0) {
    logger.info(created);
  }
  return Promise.resolve();
};
