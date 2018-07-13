# Badges

Please refer to [README.md](README.md) for more details.

### Continuous Integration

By default gardener will configure TravisCI. However you can switch to CircleCI by changing the initialization configuration. Continuous Integration is required by Semantic-Release.

#### TravisCI

**What is it?** - TravisCI allows you to set up [Continous Integration](https://docs.travis-ci.com/user/for-beginners/).

**Setup** - Create a TravisCI account on [travis-ci.org](https://travis-ci.org/), preferably with the same username that you use for github. Then enable TravisCI access for your repo.

**How to use** - Gardener takes care of setting up your configuration files. If you would like to customize TravisCI further, please refer to the [documentation](https://docs.travis-ci.com/).

#### CircleCI

**What is it?** - CircleCI allows you to set up [Continous Integration](https://circleci.com/docs/1.0/getting-started/).

**Setup** - Create a TravisCI account on [circleci.com](https://circleci.com), preferably with the same username that you use for github. Then enable CircleCi access for your repo.

**How to use** - Gardener takes care of setting up your configuration files. If you would like to customize CircleCI further, please refer to the [documentation](https://docs.travis-ci.com/).


### Coveralls

**What is it?** - Coveralls shows which parts of your code aren’t covered by your test suite. Note that Gardener currently enforces 100% test coverage.

**Setup** - Create a Coveralls account on [coveralls.io](https://coveralls.io/), preferably with the same username that you use for github. Then enable Coveralls access for your repo.

**How to use** - Coveralls will automatically receive coverage information from TravisCI. You do *not* need to specify any configuration.

### Greenkeeper

**What is it?** - Greenkeeper automatically creates pull requests with updated dependencies as soon as they become outdated.

**Setup** - Ensure [issues](https://help.github.com/articles/disabling-issues/) are enabled for your repo. Create a Greenkeeper account on [greenkeeper.io](https://greenkeeper.io/), preferably with the same username that you use for github. Then enable Greenkeeper access for your repo. The status should turn green immediately.

**How to use** - When Greenkeeper creates PRs, you need to ensure that all checks pass. If any fail, you will need to manually pull in the dependency locally and fix any issues. Often there are no problems however and you can just merge through github.

> **Important**: *Greenkeeper can create a lot of prs, since dependency pinning is enforced to ensure the package-lock.json file gets updated. Scheduled dependency updates [have been requested](https://github.com/greenkeeperio/greenkeeper/issues/808).*

### Dependencies

**What is it?** - Display badge that shows if all dependencies are up to date.

**Setup** - Create account on [david-dm.org](https://david-dm.org/). If you get an error, just try again in a new browser tab.

**How to use** - Will show a badge indicating the status of your dependencies. Especially useful since it will show if any dependencies are insecure.

### NPM and Downloads

**What is it?** - NPM makes it easy for JavaScript developers to share and reuse code, and it makes it easy to update the code that is shared.

**Setup** - Create NPM account, preferably with the same username that you use for github.

**How to use** - Once your package is published using TravisCI and Semantic-Release, you can easily install it by running `npm install --save PACKAGE_NAME`.

### Semantic-Release

**What is it?** - Semantic-Release allows you to easily and consistently publish changes to github and npm using semantic versioning.

**Setup** - Install Semantic-Release globally with

    $ npm install -g semantic-release-cli

then run

    $ semantic-release-cli setup

and follow instructions.

**How to use** - When you merge your changes into `master`, a new version is automatically published if all tests pass and changes are detected. You should adopt the [AngularJS Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit), i.e. write features as `feat: ...` and bug fixes as `fix: ...`.

### Gardener

You are currently working through this by following this Readme :)

### Gitter

**What is it?** - Chat rooms that easily allow people to ask questions about your project.

**Setup** - Login into Gitter and create a room with your project name on github.

**How to use** - Each repo should have it's own chat room, allowing people to talk sepcifically about the repo. You will get notifications and can respond to it as appropritate. This is useful for e.g. lengthy discussions that are not appropritate to happen in a github issue.
