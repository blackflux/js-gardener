# Gardener [![gardener](https://github.com/simlu/js-gardener/blob/master/assets/badge-large.svg)](https://github.com/simlu/js-gardener)

[![Build Status](https://img.shields.io/travis/simlu/js-gardener/master.svg)](https://travis-ci.org/simlu/js-gardener)
[![Test Coverage](https://img.shields.io/coveralls/simlu/js-gardener/master.svg)](https://coveralls.io/github/simlu/js-gardener?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/simlu/js-gardener.svg)](https://greenkeeper.io/)
[![NPM](https://img.shields.io/npm/v/js-gardener.svg)](https://www.npmjs.com/package/js-gardener)
[![Downloads](https://img.shields.io/npm/dt/js-gardener.svg)](https://www.npmjs.com/package/js-gardener)
[![Semantic-Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Dependencies](https://david-dm.org/simlu/js-gardener/status.svg)](https://david-dm.org/simlu/js-gardener)
[![Gardener](https://github.com/simlu/js-gardener/blob/master/assets/badge.svg)](https://github.com/simlu/js-gardener)
[![Gitter](https://img.shields.io/gitter/room/simlu/js-gardener.svg)](https://gitter.im/simlu/js-gardener)

Minimizes package setup and maintenance complexity, so you can focus on writing code. Highly recommended if you are getting started with a new package and extremely useful if you are maintaining multiple packages.

## What it does

- Enforces best code style practises using [ESLint](https://eslint.org/) and [YAMLlint](https://github.com/nodeca/js-yaml)
- Automates and assists with config generation
- Provides various integrity tests (e.g. checks for un-used dependencies)
- Enforces 100% test coverage using [Istanbul](https://istanbul.js.org/)
- Enables [Continuous Integration](https://en.wikipedia.org/wiki/Continuous_integration) using [TravisCI](https://travis-ci.org/)
- Enables [Continuous Delivery](https://en.wikipedia.org/wiki/Continuous_delivery) to [NPM](https://www.npmjs.com/) and [GitHub](https://github.com/) using [Semantic-Release](https://github.com/semantic-release/semantic-release) 
- Enables automates dependency updates using [Greenkeeper](https://greenkeeper.io/).

# Getting Started

### Requirements

Install grunt globally with `npm install -g grunt`.

### Preparation

- Create New Project (e.g. using Webstorm)
- Create New Repository on Github
- Run `git init`, `git remote add origin URL`, `git checkout -b master`
- Run `npm init` and fill in details

### Install Gardener

    $ npm install --save-dev js-gardener

### Run Basic Setup

Create `gruntfile.js` in the root folder with the following contents

```javascript
module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    gardener: {
      this: {
        options: {}
      }
    }
  });

  grunt.loadNpmTasks('js-gardener');
};
```

Then run

    $ grunt gardener

This will generate some files and alter your existing package.json file.

# Structure

**Folders** - Write your tests in the `test` and your code in the `lib` folder.

**Branches** - You release branch is `master`. Develop against `develop` or feature branches. When you are ready for a release, merge your changes into `master`.

# Badges

Badges represent external services that integrate with your repository. The Badges are auto generated, but the services need to be enabled manually. This section will instruct you on how to set up and utilize each service. When completed, verify each service by clicking the corresponding badge.

Before configuring external services, ensure `npm test` runs locally without errors and all changes are pushed.

> [Afterwards Setup Badges](BADGES.md)

*Note:* If you username is different between github and a service, you will need to adjust the badge url.

# Options

### skip

Type: `array`<br>
Default: `[]`

Array of tasks to skip. Should not be necessary to use unless you really need to. Available tasks are:
- `mkdir`: Auto create [folders](lib/templates/folders.json)
- `copy`: Copy [template files](lib/templates/files)
- `gardener_configure`: [Alter](lib/templates) configuration files, insert [badges](lib/templates/badges.json)
- `projectUpdate`: Install dependencies exactly as specified in package.json
- `eslint`: Ensure code is according to [best eslint practises](lib/conf/eslint.json)
- `yamllint`: Ensure yaml files are passing lint
- `depcheck`: Ensure all installed dependencies are used
- `checkDependencies`: Ensure dependencies are installed as specified in package.json
- `mocha_istanbul`: Run tests in `test` folder and force 100% coverage

### root

Type: `string`<br>
Default: `process.cwd()`

Specify the directory to run the tests against. Useful if you have multiple packages that you manage centralized from a parent folder.

# Ignore Files

### .coverignore

Define files which should be excluded from coverage. Always excluded files can be found [here](lib/conf/.coverignore).

### .eslintignore

Define files which should be excluded for eslint. Always excluded files can be found [here](lib/conf/.eslintignore).

### .depunusedignore

Define packages that should be excluded from usage check. Useful when a false negative is detected, e.g. for plugins where usage is defined in configuration. Always excluded packages can be found [here](lib/conf/.depunusedignore).

# Sample Project

While this project utilizes itself for testing - how cool is that? - a cleaner example (without the grunt file) can be found [here](test/mock).

All [my npm packages](https://www.npmjs.com/~simlu) also utilize Gardener.

# How to Contribute

When you contribute to any Gardener repositories, always run `npm test` locally before opening a PR.

### Desired Changes

- Move all grunt tasks into separate function
- Use something more suitable than grunt
- Add more configuration options
