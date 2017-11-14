# Gardener [![gardener](https://github.com/simlu/grunt-gardener/blob/master/assets/badge-large.svg)](https://github.com/simlu/grunt-gardener)

[![Build Status](https://img.shields.io/travis/simlu/grunt-gardener/master.svg)](https://travis-ci.org/simlu/grunt-gardener)
[![Test Coverage](https://img.shields.io/coveralls/simlu/grunt-gardener/master.svg)](https://coveralls.io/github/simlu/grunt-gardener?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/simlu/grunt-gardener.svg)](https://greenkeeper.io/)
[![NPM](https://img.shields.io/npm/v/grunt-gardener.svg)](https://www.npmjs.com/package/grunt-gardener)
[![Downloads](https://img.shields.io/npm/dt/grunt-gardener.svg)](https://www.npmjs.com/package/grunt-gardener)
[![Semantic-Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Gardener](https://github.com/simlu/grunt-gardener/blob/master/assets/badge.svg)](https://github.com/simlu/grunt-gardener)
[![Gitter](https://img.shields.io/gitter/room/simlu/grunt-gardener.svg)](https://gitter.im/simlu/grunt-gardener)

Minimizes package setup and maintenance complexity, so you can focus on writing code. Highly recommended if you are getting started with a new package and extremely useful if you are maintaining multiple packages.

Gardener enforces many best code style practises using [ESLint](https://eslint.org/) and [YAMLlint](https://github.com/nodeca/js-yaml), semi-automates config generation, provides various integrity tests (e.g. checks for un-used dependencies), enforces 100% test coverage using [Istanbul](https://istanbul.js.org/) and helps you set up [CI](https://en.wikipedia.org/wiki/Continuous_integration) using [TravisCI](https://travis-ci.org/), [CD](https://en.wikipedia.org/wiki/Continuous_delivery) using [Semantic-Release](https://github.com/semantic-release/semantic-release) ([NPM](https://www.npmjs.com/), [GitHub](https://github.com/)) and semi-automatic dependency updates using [Greenkeeper](https://greenkeeper.io/).

# Getting Started

### Preparation

- Create New Project
- Create Empty Repository
- Run `git init`, `git remote add origin URL`, `git checkout -b master`
- Run `npm init` and fill in details

### Install Gardener

    $ npm install --save-dev grunt-gardener

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

  grunt.loadNpmTasks('grunt-gardener');
};
```

Then run

    $ grunt gardener

This will generate some files and alter your existing package.json file.

# Structure

**Folders** - Write your tests in the `test` and your code in the `lib` folder.

**Branches** - You release branch is `master`. Develop against `develop` or feature branches. When you are ready for a release, merge your changes into `master`.

# Badges

Badges represent external services that integrate with your repository. This section will instruct you on how to set up and utilize each service. When completed, verify each service by clicking the corresponding badge.

If you username is different between github and a service, you will need to adjust the badge url.

### Travis

**What is it?** - TravisCI is used for [Continous Integration](https://docs.travis-ci.com/user/for-beginners/). It is also required by Semantic-Release.

**Setup** - Create TravisCI account on [travis-ci.org](https://travis-ci.org/), preferably with the same username that you use for github. Then enable TravisCI access to your repo.

**How to use** - Gardener takes care of setting up your configuration files. However if you want customize TravisCI, please refer to the [documentation](https://docs.travis-ci.com/).

### Coveralls

**What is it?** - Coveralls shows which parts of your code aren’t covered by your test suite. Note that Gardener currently enforces 100% test coverage.

**Setup** - Create Coveralls account, preferably with the same username that you use for github. Then enable Coveralls access to your repo.

**How to use** - Coveralls will automatically receive coverage information from TravisCI. You do *not* need to specify any configuration. More information can be found [here](https://coveralls.io/).

### Greenkeeper

**What is it?** - Greenkeeper automatically creates pull request with updated dependencies as soon as they become outdated.

**Setup** - Create Greenkeeper account, preferably with the same username that you use for github. Then enable Greenkeeper access to your repo. No initial PR should be created and the status should turn green immediately.

**How to use** - When Greenkeeper creates PRs you need to ensure that all checks pass. If they don't you will need to manually pull in the dependency locally and fix any issues. Often there are no problems however and you can just click the merge button.

### NPM and Downloads

**What is it?** - NPM makes it easy for JavaScript developers to share and reuse code, and it makes it easy to update the code that you're sharing.

**Setup** - Create NPM account, preferably with the same username that you use for github.

**How to use** - Once your package is published you can easily install it by running `npm install --save PACKAGE_NAME`.

### Semantic-Release

**What is it?** - Semantic-Release allows you to easily and consistently publish changes to github and npm.

**Setup** - Install Semantic-Release globally with

    $ npm install -g semantic-release-cli

then run

    $ semantic-release-cli setup

and follow instructions.

**How to use** - When you merge your changes into `master`, a new version is automatically published if all tests pass and changes are detected.

### Gardener

You've already enabled this by following the first steps of the Readme.

### Gitter

**What is it?** - Chat rooms that easily allow people to ask questions about your project.

**Setup** - Log into Gitter and create a room with your project name on github.

**How to use** - Each repo should have it's own chat room, allowing people to talk about the repo. You will get notifications if people ask questions and can respond to it as appropritate. This is useful for e.g. lengthy discussions that are not appropritate to happen in a github issue.

# Options

### skip

Type: `array`<br>
Default: `[]`

Array of tasks to skip. Should not be necessary to use unless you really need to. Available tasks are:
- `mkdir`: Auto create folders
- `copy`: Copy template files
- `gardener_configure`: Alter configuration files, insert badges
- `projectUpdate`: Install dependencies exactly as specified in package.json
- `eslint`: Ensure code is according to best eslint practises
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

When you contribute to any Gardener repositories, always run `npm test` locally before you open a PR.
