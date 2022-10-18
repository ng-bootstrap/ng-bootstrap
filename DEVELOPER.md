# Building and Testing ng-bootstrap

This document describes how to set up your development environment to build and test ng-bootstrap.
It also explains the basic mechanics of using `git`, `node` and `yarn`.

- [Prerequisite Software](#prerequisite-software)
- [Getting the Sources](#getting-the-sources)
- [Installing Dependencies](#installing-dependencies)
- [Project Structure](#project-structure)
- [Useful Commands](#useful-commands)
- [Code Formatting](#code-formatting)
- [Commit Messages](#commit-messages)

See the [contribution guidelines](https://github.com/ng-bootstrap/ng-bootstrap/blob/master/CONTRIBUTING.md)
if you'd like to contribute to ng-bootstrap.

## Prerequisite Software

Before you can build and test ng-bootstrap, you must install and configure the
following products on your development machine:

- [Git](http://git-scm.com) and/or the **GitHub app** (for [Mac](http://mac.github.com) or
  [Windows](http://windows.github.com)); [GitHub's Guide to Installing
  Git](https://help.github.com/articles/set-up-git) is a good source of information.

- [Node.js](https://nodejs.org), (LTS version `>=14.15.0`) which is used to run tests, and generate distributable files. Depending on your system, you can install Node either from
  source or as a pre-packaged bundle.

- We use [Yarn](https://yarnpkg.com) (version `>=1.15.2`) to manage dependencies. See `.yarnrc` amd `.yarn/README.md` for more info.

## Getting the Sources

Fork and clone the ng-bootstrap repository:

1. Login to your GitHub account or create one by following the instructions given
   [here](https://github.com/signup/free).
2. [Fork](http://help.github.com/forking) the [main ng-bootstrap
   repository](https://github.com/ng-bootstrap/ng-bootstrap).
3. Clone your fork of the ng-bootstrap's ng-bootstrap repository and define an `upstream` remote pointing back to
   the ng-bootstrap's ng-bootstrap repository that you forked in the first place.

```bash
# Clone your GitHub repository:
git clone git@github.com:<github username>/ng-bootstrap.git ng-bootstrap

# Go to the ng-bootstrap directory:
cd ng-bootstrap

# Add the main ng-bootstrap repository as an upstream remote to your repository:
git remote add upstream https://github.com/ng-bootstrap/ng-bootstrap.git
```

## Installing Dependencies

Next, install the JavaScript modules needed to build and test ng-bootstrap:

```bash
# Install ng-bootstrap project dependencies (package.json)
yarn
```

## Project Structure

We use [`@angular/cli`](https://cli.angular.io) to build both ng-bootstrap library and demo site. There are several Angular CLI projects inside the checked out code:

- `/src` - the `ng-bootstrap` library itself
- `/demo` - the demo site application deployed at [https://ng-bootstrap.github.io](https://ng-bootstrap.github.io)
- `/e2e-app` - an application used to run e2e tests for the library
- `/ssr-app/src` - a simple one-paged application for Server Side Rendering tests
- `/test-app` - a minimal CLI application that references `ng-bootstrap` sources for issue reproduction/debugging purposes

## Useful Commands

The most useful commands are:

#### `yarn demo`

Serves the demo site locally in dev mode at [http://localhost:4200/](http://localhost:4200/). You can optionally add `--prod` argument to serve demo in production mode or `--aot` to serve demo in dev mode, but with AOT

#### `yarn build`

Builds both library and demo site in production mode. The library will be built in Angular Package format in `dist` folder. The demo site will be built in `demo/dist` folder.

#### `yarn tdd`

Runs unit tests for the library in watch mode without any additional checks

**Note**: If you want to only run a single test you can alter the test you wish to run by changing
`it` to `fit` or `describe` to `fdescribe`. This will only run that individual test and make it
much easier to debug. `xit` and `xdescribe` can also be useful to exclude a test and a group of
tests respectively.

#### `yarn test`

Lints the source code and runs all unit tests for the library with coverage

#### `yarn e2e`

Runs all e2e tests for the library in production mode. We use them to check focus handling, browser styles, layout, etc.
(For debugging/development it is also possible to separately serve the e2e test application with `yarn e2e-app:serve` and run tests with `yarn ngb:e2e-noserve`)

#### `yarn ssr`

Builds, runs and e2e tests a simple server-side rendered application with all ng-bootstrap components

#### `yarn ci`

Runs exactly the same suite of actions as the CI server, so you might want to do it before opening a PR

You can inspect `package.json` scripts section for a full list of commands available.

## Code Formatting

We use [Prettier](https://prettier.io) to automatically enforce code formatting for most of the files we have.
This allows us to focus on code reviews and features, and not on style nit-picking.

Prettier integrates easily in many modern IDEs, but on top of this your code should be formatted automatically with
[Husky](https://github.com/typicode/husky) and a pre-commit hook.

```bash

# we enforce formatting during CI with
yarn check-format

# you can also force format the code with
yarn format
```

## Commit messages

We use [CommitLint](https://commitlint.js.org/) to enforce commit messages and have a clean git history.
Commit format will be enforced with [Husky](https://github.com/typicode/husky) and a `commit-msg` hook.

Here is an example of the commit message that provides a title, an explanation and references a GitHub issue:

```
fix(tooltip): allow 'null' and 'undefined' as values for tooltip

The documentation says that falsy values are accepted,
but in strict mode, only the empty string could actually be passed.

Fixes #3845
```

We maintain dynamic custom scopes for the project. Valid scopes correspond to the name of our widgets: `alert`, `accordion`, etc.

More examples:

- `feat(datepicker): ...` &rarr; a new feature for the datepicker
- `fix(datepicker): ...` &rarr; a bug fix for the datepicker
- `test(datepicker): ... ` &rarr; an update to one of the datepicker unit or e2e tests
- `docs(datepicker): ...` &rarr; a datepicker documentation update
- `refactor(datepicker): ... ` &rarr; an internal datepicker refactoring without public functionality changes
- `demo(datepicker): ... ` &rarr; an update to one of the datepicker demos
- `demo: ...` &rarr; any change for the demo site
- `build: ...` &rarr; any change for the utility scripts, configurations, dependencies, etc.
- `ci: ...` &rarr; any change for CI related configuration
- `revert: ...` &rarr; revert an older commit

Anything else won't pass validation.
