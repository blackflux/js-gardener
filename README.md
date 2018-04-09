# Gardener [![gardener](https://github.com/simlu/js-gardener/blob/master/assets/badge-large.svg)](https://github.com/simlu/js-gardener)

[![Build Status](https://img.shields.io/travis/simlu/js-gardener/master.svg)](https://travis-ci.org/simlu/js-gardener)
[![Test Coverage](https://img.shields.io/coveralls/simlu/js-gardener/master.svg)](https://coveralls.io/github/simlu/js-gardener?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/simlu/js-gardener.svg)](https://greenkeeper.io/)
[![Dependencies](https://david-dm.org/simlu/js-gardener/status.svg)](https://david-dm.org/simlu/js-gardener)
[![NPM](https://img.shields.io/npm/v/js-gardener.svg)](https://www.npmjs.com/package/js-gardener)
[![Downloads](https://img.shields.io/npm/dt/js-gardener.svg)](https://www.npmjs.com/package/js-gardener)
[![Semantic-Release](https://github.com/simlu/js-gardener/blob/master/assets/icons/semver.svg)](https://github.com/semantic-release/semantic-release)
[![Gardener](https://github.com/simlu/js-gardener/blob/master/assets/badge.svg)](https://github.com/simlu/js-gardener)
[![Gitter](https://github.com/simlu/js-gardener/blob/master/assets/icons/gitter.svg)](https://gitter.im/simlu/js-gardener)

Enforces highest code quality and minimizes package setup and maintenance complexity - so you can focus on writing code. Highly recommended if you are getting started with a new package and extremely useful if you are maintaining multiple packages.

## What it does

- Enforces best code style practises using [ESLint](https://eslint.org/) and [YAMLlint](https://github.com/nodeca/js-yaml)
- Automates and assists with config generation
- Provides various integrity tests (e.g. checks for un-used dependencies)
- Enforces 100% test coverage using [Nyc](https://github.com/istanbuljs/nyc)
- Enables [Continuous Integration](https://en.wikipedia.org/wiki/Continuous_integration) using [TravisCI](https://travis-ci.org/)
- Enables [Continuous Delivery](https://en.wikipedia.org/wiki/Continuous_delivery) to [NPM](https://www.npmjs.com/) and [GitHub](https://github.com/) using [Semantic-Release](https://github.com/semantic-release/semantic-release)
- Enables automates dependency updates using [Greenkeeper](https://greenkeeper.io/).

# Getting Started

### Preparation

- Create New Project (e.g. using [Webstorm](https://www.jetbrains.com/webstorm/download/))
- Create New Repository on Github
- Run `git init`, `git remote add origin URL`, `git checkout -b master`
- Run `npm init` and fill in details

### Install Gardener

    $ npm install --save-dev js-gardener

### Run Basic Setup

Create `gardener.js` in the root folder with the following contents
<!-- eslint-disable import/no-unresolved -->
```javascript
// eslint-disable-next-line import/no-extraneous-dependencies
const gardener = require('js-gardener');

if (require.main === module) {
  gardener().catch(() => process.exit(1));
}
```

Then run

    $ node gardener

This will generate some files and alter your existing package.json file.

Create your files in the `src` folder and corresponding tests in the `test` folder ([Mocha](https://mochajs.org/) and [Chai](https://github.com/chaijs/chai) work great), and ensure everything works fine by running `npm test`. Finalize your README.md and package.json and commit and push to GitHub.

Now configure your Badges.

# Run Tests Locally

To run all tests locally

    $ npm test

and in debug mode with

    $ npm test -- --debug

# Structure

**Folders** - Write your tests in the `test` and your code in the `src` folder. The lib folder is used as the build target. Test files must be of format `*.spec.js`.

**Branches** - You release branch is `master`. Develop against `develop` or feature branches. When you are ready for a release, merge your changes into `master`.

# Badges

Badges represent external services that integrate with your repository. The Badges are auto generated, but the services need to be enabled manually. This section will instruct you on how to set up and utilize each service. When completed, verify each service by clicking the corresponding badge.

Before configuring external services, ensure `npm test` runs locally without errors and all changes are pushed.

> [Configure Badges](BADGES.md)

*Note:* If you username is different between github and a service, you will need to adjust the badge url.

# Coverage

Customize the nyc section in your package.json

# Using Flow

Define your flow interfaces in `flow-typed` folder (as plain flow) and then use the `// @flow` syntax to enable for appropriate files.

Consider using [flow-typed](https://github.com/flowtype/flow-typed) to auto generate flow schemas.

To enforce flow syntax in every file you can set the corresponding eslint rule.

# Options

### skip

Type: `array`<br>
Default: `[]`

Array of tasks to skip. Should not be necessary to use unless you really need to. Available tasks are:
- `copy`: Copy [template files](lib/templates/files) and create [folders](lib/templates/folders.json)
- `package`: [Alter](lib/templates/package.json) package.json
- `configure`: [Alter](lib/templates) other configuration files
- `badges`: Insert [Badges](lib/templates/badges.json)
- `structure`: Enforce that test file structure matches lib content
- `eslint`: Ensure code is according to [best eslint practises](lib/conf/eslint.json)
- `flow`: Execute [flow](https://flow.org) validation for enabled files.
- `yamllint`: Ensure yaml files are passing lint
- `depcheck`: Ensure dependencies are installed as specified in package.json
- `depused`: Ensure all installed dependencies are used

### rules

Type: `object`<br>
Default: `{}`

Object of custom eslint rules to set.
- `flow-enforce`: Set to `1` to enforce flow for every file. Enforced by default.

### cwd

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

### .structignore

Define test files that should not be checked for structure. Usually not necessary. Always excluded test files can be found [here](lib/conf/.structignore).

# Example Projects

While this project utilizes itself for testing - how cool is that? - a cleaner example can be found [here](test/mock).

Example project using [js-gardener](https://github.com/simlu/js-gardener) and [lambda-tdd](https://github.com/simlu/lambda-tdd) can be found [here](https://github.com/simlu/lambda-example).

All [my npm packages](https://www.npmjs.com/~simlu) also utilize Gardener.

# How to Contribute

When you contribute to any Gardener repositories, always run `npm test` locally before opening a PR.

### Desired Changes

- Add more configuration options
