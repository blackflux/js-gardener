# Gardener [![gardener](https://github.com/simlu/grunt-gardener/blob/master/assets/badge-large.svg)](https://github.com/simlu/grunt-gardener)

[![Build Status](https://img.shields.io/travis/simlu/grunt-gardener/master.svg)](https://travis-ci.org/simlu/grunt-gardener)
[![Test Coverage](https://img.shields.io/coveralls/simlu/grunt-gardener/master.svg)](https://coveralls.io/github/simlu/grunt-gardener?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/simlu/grunt-gardener.svg)](https://greenkeeper.io/)
[![NPM](https://img.shields.io/npm/v/grunt-gardener.svg)](https://www.npmjs.com/package/grunt-gardener)
[![Downloads](https://img.shields.io/npm/dt/grunt-gardener.svg)](https://www.npmjs.com/package/grunt-gardener)
[![Semantic-Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Gardener](https://github.com/simlu/grunt-gardener/blob/master/assets/badge.svg)](https://github.com/simlu/grunt-gardener)
[![Gitter](https://img.shields.io/gitter/room/simlu/grunt-gardener.svg)](https://gitter.im/simlu/grunt-gardener)

Minimizes project setup and maintenance complexity, so you can focus on writing code. Highly recommended if you are getting started with a new project or module and extremely useful if you are maintaining multiple modules.

Gardener enforces many best code style practises using [ESLint](https://eslint.org/) and [YAMLlint](https://github.com/nodeca/js-yaml), semi-automates config generation, provides various integrity tests (e.g. checks for un-used dependencies), enforces 100% test coverage using [Istanbul](https://istanbul.js.org/) and helps you set up [CI](https://en.wikipedia.org/wiki/Continuous_integration) using [TravisCI](https://travis-ci.org/), [CD](https://en.wikipedia.org/wiki/Continuous_delivery) using [Semantic-Release](https://github.com/semantic-release/semantic-release) ([NPM](https://www.npmjs.com/), [GitHub](https://github.com/)) and semi-automatic dependency updates using [Greenkeeper](https://greenkeeper.io/).

# Getting Started

### Preparation

- Create New Project
- Create Empty Repository
- Run `git init`, `git remote add origin URL`, `git checkout -b master`
- Run `npm init` and fill in details

### Install Gardener

    # npm install --save-dev grunt-gardener

### Run Basic Setup

    # grunt gardener

This will generate some files and alter your existing package.json file.

# Details

...
