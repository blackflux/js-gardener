# Gardener [![gardener](https://img.shields.io/badge/-Gardener-green.svg?style=for-the-badge&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiA%2FPjxzdmcgdmlld0JveD0iMCAwIDMyIDMyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxzdHlsZT4uY2xzLTF7ZmlsbDpub25lO3N0cm9rZTojZmZmO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MnB4O308L3N0eWxlPjwvZGVmcz48dGl0bGUvPjxnIGRhdGEtbmFtZT0iMjU2LVRyZWUiIGlkPSJfMjU2LVRyZWUiPjxwb2x5bGluZSBjbGFzcz0iY2xzLTEiIHBvaW50cz0iMTYgMzIgMTYgMTAgMTMgNyIvPjxsaW5lIGNsYXNzPSJjbHMtMSIgeDE9IjE2IiB4Mj0iMjAiIHkxPSIxNiIgeTI9IjEyIi8%2BPGxpbmUgY2xhc3M9ImNscy0xIiB4MT0iMTYiIHgyPSIxMiIgeTE9IjE5IiB5Mj0iMTUiLz48bGluZSBjbGFzcz0iY2xzLTEiIHgxPSIxNiIgeDI9IjE5IiB5MT0iMTAiIHkyPSI3Ii8%2BPGNpcmNsZSBjbGFzcz0iY2xzLTEiIGN4PSIxNiIgY3k9IjEyIiByPSIxMSIvPjwvZz48L3N2Zz4%3D)](https://github.com/simlu/grunt-gardener)

[![Build Status](https://img.shields.io/travis/simlu/grunt-gardener/master.svg)](https://travis-ci.org/simlu/grunt-gardener)
[![Test Coverage](https://img.shields.io/coveralls/simlu/grunt-gardener/master.svg)](https://coveralls.io/github/simlu/grunt-gardener?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/simlu/grunt-gardener.svg)](https://greenkeeper.io/)
[![NPM](https://img.shields.io/npm/v/grunt-gardener.svg)](https://www.npmjs.com/package/grunt-gardener)
[![Downloads](https://img.shields.io/npm/dt/grunt-gardener.svg)](https://www.npmjs.com/package/grunt-gardener)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![gardener](https://img.shields.io/badge/-Gardener-green.svg?style=flat&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiA%2FPjxzdmcgdmlld0JveD0iMCAwIDMyIDMyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxzdHlsZT4uY2xzLTF7ZmlsbDpub25lO3N0cm9rZTojZmZmO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MnB4O308L3N0eWxlPjwvZGVmcz48dGl0bGUvPjxnIGRhdGEtbmFtZT0iMjU2LVRyZWUiIGlkPSJfMjU2LVRyZWUiPjxwb2x5bGluZSBjbGFzcz0iY2xzLTEiIHBvaW50cz0iMTYgMzIgMTYgMTAgMTMgNyIvPjxsaW5lIGNsYXNzPSJjbHMtMSIgeDE9IjE2IiB4Mj0iMjAiIHkxPSIxNiIgeTI9IjEyIi8%2BPGxpbmUgY2xhc3M9ImNscy0xIiB4MT0iMTYiIHgyPSIxMiIgeTE9IjE5IiB5Mj0iMTUiLz48bGluZSBjbGFzcz0iY2xzLTEiIHgxPSIxNiIgeDI9IjE5IiB5MT0iMTAiIHkyPSI3Ii8%2BPGNpcmNsZSBjbGFzcz0iY2xzLTEiIGN4PSIxNiIgY3k9IjEyIiByPSIxMSIvPjwvZz48L3N2Zz4%3D)](https://github.com/simlu/grunt-gardener)
[![Gitter](https://img.shields.io/gitter/room/simlu/grunt-gardener.svg)](https://gitter.im/simlu/grunt-gardener)

Highly recommended if you are getting started with a new project or module and extremely useful if you are maintaining multiple npm modules.

Gardener enforces many best code style practises using [ESLint](https://eslint.org/) and [YAMLlint](https://github.com/nodeca/js-yaml), semi-automates config generation, provides various integrity tests (e.g. checks for un-used dependencies), enforces 100% test coverage using [Istanbul](https://istanbul.js.org/) and helps you set up [CI](https://en.wikipedia.org/wiki/Continuous_integration) using [TravisCI](https://travis-ci.org/), [CD](https://en.wikipedia.org/wiki/Continuous_delivery) using [Semantic-Release](https://github.com/semantic-release/semantic-release) ([NPM](https://www.npmjs.com/), [GitHub](https://github.com/)) and semi-automatic dependency updates using [Greenkeeper](https://greenkeeper.io/).

![](https://img.shields.io/badge/ESLint-%E2%9C%93-green.svg?style=for-the-badge)
![](https://img.shields.io/badge/Semantic-Release-%E2%9C%93-green.svg?style=for-the-badge)
![](https://img.shields.io/badge/YAMLlint-%E2%9C%93-green.svg?style=for-the-badge)
![](https://img.shields.io/badge/YAMLlint-%E2%9C%93-green.svg?style=for-the-badge)
![](https://img.shields.io/badge/TravisCI-%E2%9C%93-green.svg?style=for-the-badge)
![](https://img.shields.io/badge/Greenkeeper-%E2%9C%93-green.svg?style=for-the-badge)

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

This will generate some files.

# Details

...
