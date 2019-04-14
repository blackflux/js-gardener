# Gardener [![gardener](https://github.com/blackflux/js-gardener/blob/master/assets/badge-large.svg)](https://github.com/blackflux/js-gardener)

[![Build Status](https://circleci.com/gh/blackflux/js-gardener.png?style=shield)](https://circleci.com/gh/blackflux/js-gardener)
[![Test Coverage](https://img.shields.io/coveralls/blackflux/js-gardener/master.svg)](https://coveralls.io/github/blackflux/js-gardener?branch=master)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=blackflux/js-gardener)](https://dependabot.com)
[![Dependencies](https://david-dm.org/blackflux/js-gardener/status.svg)](https://david-dm.org/blackflux/js-gardener)
[![NPM](https://img.shields.io/npm/v/js-gardener.svg)](https://www.npmjs.com/package/js-gardener)
[![Downloads](https://img.shields.io/npm/dt/js-gardener.svg)](https://www.npmjs.com/package/js-gardener)
[![Semantic-Release](https://github.com/blackflux/js-gardener/blob/master/assets/icons/semver.svg)](https://github.com/semantic-release/semantic-release)
[![Gardener](https://github.com/blackflux/js-gardener/blob/master/assets/badge.svg)](https://github.com/blackflux/js-gardener)

Enforces highest code quality and minimizes package setup and maintenance complexity - so you can focus on writing code. Highly recommended if you are getting started with a new package and extremely useful if you are maintaining multiple packages.

## What it does

- Enforces best code style practises using [ESLint](https://eslint.org/) and [YAMLlint](https://github.com/nodeca/js-yaml)
- Automates and assists with config generation and best practices via [robo-config](https://github.com/blackflux/robo-config)
- Scans dependencies for vulnerabilities using [npm audit](https://docs.npmjs.com/cli/audit)
- Provides various integrity tests (e.g. checks for un-used dependencies)
- Enforces 100% test coverage using [Nyc](https://github.com/istanbuljs/nyc)

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

Now create a `.roboconfig.json` file. Recommended for OpenSource npm packages is the following:

```json
{
  "@blackflux/robo-config-plugin": {
    "tasks": [
      "assorted/@npm-opensource"
    ],
    "variables": {
      "repoKey": "org-name/repo-name",
      "packageName": "repo-name",
      "projectName": "repo-name",
      "owner": "owner-name",
      "ownerName": "Owner Name",
      "mergeBot": "mergebot-name"
    }
  }
}

```

Then run

    $ node gardener

This will generate some files and alter your existing package.json file.

Create your files in the `src` folder and corresponding tests in the `test` folder ([Mocha](https://mochajs.org/) and [Chai](https://github.com/chaijs/chai) work great), and ensure everything works fine by running `npm test`. Finalize your README.md and package.json and commit and push to GitHub.

# Run Tests Locally

To run all tests locally

    $ npm t

and in debug mode with

    $ npm t -- --debug

All Mocha options can be passed using double dash. E.g. to run individual tests

    $ npm run test-simple -- -g "Partial Test Description Here"

To auto fix fixable eslint problems run

    $ node gardener.js --fix

# Structure

**Folders** - Write your tests in the `test` and your code in the `src` folder. The lib folder is used as the build target. Test files must be of format `*.spec.js`.

**Branches** - You release branch is `master`. Develop against `dev` or feature branches. When you are ready for a release, merge your changes into `master`.

# Coverage

Customize the nyc section in your package.json

To completely ignore files from coverage put them into the `exclude` section in nyc.

# Options

### logger

Type: `logger`<br>
Default: [`fancy-log`](https://www.npmjs.com/package/fancy-log)

Attach custom logger.

### skip

Type: `array`<br>
Default: `[]`

Array of tasks to skip. Should not be necessary to use unless you really need to. Available tasks are:
- `robo`: Apply [robo-config](https://github.com/blackflux/robo-config) configuration file.
- `package`: [Alter](lib/templates/package.json) package.json
- `structure`: Enforce that test file structure matches lib content
- `audit`: Runs [npm audit](https://docs.npmjs.com/getting-started/running-a-security-audit) and throws errors for old or important issues.
- `eslint`: Ensure code is according to eslint definitions.
- `yamllint`: Ensure yaml files are passing lint
- `depcheck`: Ensure dependencies are installed as specified in package.json
- `depused`: Ensure all installed dependencies are used

### cwd

Type: `string`<br>
Default: `process.cwd()`

Specify the directory to run the tests against. Useful if you have multiple packages that you manage centralized from a parent folder.

### docker

Type: `boolean`<br>
Default: `false`

Execution will fail if not inside docker container, when set to `true`.

# Ignore Files

### .eslintignore

Define files which should be excluded for eslint. Always excluded files can be found [here](lib/conf/.eslintignore).

### .depunusedignore

Define packages that should be excluded from usage check. Useful when a false negative is detected, e.g. for plugins where usage is defined in configuration. Always excluded packages can be found [here](lib/conf/.depunusedignore).

### .structignore

Define test files that should not be checked for structure. Usually not necessary. Always excluded test files can be found [here](lib/conf/.structignore).

# Example Projects

While this project utilizes itself for testing - how cool is that? - a cleaner example can be found [here](test/mock).

Example project using [js-gardener](https://github.com/blackflux/js-gardener) and [lambda-tdd](https://github.com/blackflux/lambda-tdd) can be found [here](https://github.com/blackflux/lambda-example).

All [blackflux npm packages](https://www.npmjs.com/org/blackflux) also utilize Gardener.
