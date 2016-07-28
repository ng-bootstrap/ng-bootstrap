# Building and Testing ng-bootstrap

This document describes how to set up your development environment to build and test ng-bootstrap.
It also explains the basic mechanics of using `git`, `node`, and `npm`.

* [Prerequisite Software](#prerequisite-software)
* [Getting the Sources](#getting-the-sources)
* [Installing NPM Modules](#installing-npm-modules)
* [Build commands](#build-commands)
* [Running Tests Locally](#running-tests-locally)
* [Formatting](#clang-format)

See the [contribution guidelines](https://github.com/ng-bootstrap/ng-bootstrap/blob/master/CONTRIBUTING.md)
if you'd like to contribute to ng-bootstrap.

## Prerequisite Software

Before you can build and test ng-bootstrap, you must install and configure the
following products on your development machine:

* [Git](http://git-scm.com) and/or the **GitHub app** (for [Mac](http://mac.github.com) or
  [Windows](http://windows.github.com)); [GitHub's Guide to Installing
  Git](https://help.github.com/articles/set-up-git) is a good source of information.

* [Node.js](http://nodejs.org), (version `>=4.2.1 <6`) which is used to run tests, and generate distributable files. We also use Node's Package Manager, `npm` 
  (version `>3.8.x`), which comes with Node. Depending on your system, you can install Node either from 
  source or as a pre-packaged bundle.

* [Chrome](https://www.google.es/chrome/browser/desktop/index.html), we use Chrome to run our tests.

## Getting the Sources

Fork and clone the ng-bootstrap repository:

1. Login to your GitHub account or create one by following the instructions given
   [here](https://github.com/signup/free).
2. [Fork](http://help.github.com/forking) the [main ng-bootstrap
   repository](https://github.com/ng-bootstrap/ng-bootstrap).
3. Clone your fork of the ng-bootstrap's ng-bootstrap repository and define an `upstream` remote pointing back to
   the ng-bootstrap's ng-bootstrap repository that you forked in the first place.

```shell
# Clone your GitHub repository:
git clone git@github.com:<github username>/ng-bootstrap.git ng-bootstrap

# Go to the ng-bootstrap directory:
cd ng-bootstrap

# Add the main ng-bootstrap repository as an upstream remote to your repository:
git remote add upstream https://github.com/ng-bootstrap/ng-bootstrap.git
```

## Installing NPM Modules and typings

Next, install the JavaScript modules needed to build and test ng-bootstrap:

```shell
# Install ng-bootstrap project dependencies (package.json)
npm install
# Install types
npm run typings install
```

Globally install gulp as follows:

* `npm install -g gulp` (you might need to prefix this command with `sudo`)

## Build commands

To build ng-bootstrap, run:

```shell
$(npm bin)/gulp build
```

Notes:
* Results are put in the `dist` folder in `cjs` format. A `esm` folder and a `UMD` build at `bundles`.

To clean out the `dist` folder, run:

```shell
$(npm bin)/gulp clean:build
```

## Running tests locally

* `$(npm bin)/gulp`

That will check the formatting and run the full test suite.

If you want to run your tests in **watch mode**, you can use:

* `$(npm bin)/gulp tdd`

The task updates the `temp` folder with transpiled code whenever a source or test file changes, and
Karma is run against the new output.

**Note**: If you want to only run a single test you can alter the test you wish to run by changing
`it` to `fit` or `describe` to `fdescribe`. This will only run that individual test and make it
much easier to debug. `xit` and `xdescribe` can also be useful to exclude a test and a group of
tests respectively.

## Running demo locally

* `$(npm bin)/gulp demo-server` and go to [http://localhost:9090/](http://localhost:9090/)

## Formatting with <a name="clang-format">clang-format</a>

We use [clang-format](http://clang.llvm.org/docs/ClangFormat.html) to automatically enforce code
style for our TypeScript code. This allows us to focus our code reviews more on the content, and
less on style nit-picking. It also lets us encode our style guide in the `.clang-format` file in the
repository, allowing many tools and editors to share our settings.

To check the formatting of your code, run

    gulp check-format

Note that the continuous build on Travis runs `gulp enforce-format`. Unlike the `check-format` task,
this will actually fail the build if files aren't formatted according to the style guide.

Your life will be easier if you include the formatter in your standard workflow. Otherwise, you'll
likely forget to check the formatting, and waste time waiting for a build on Travis that fails due
to some whitespace difference.

* Install clang-format with `npm install -g clang-format`.
* Use `clang-format -i [file name]` to format a file (or multiple).
  Note that `clang-format` tries to load a `clang-format` node module close to the sources being
  formatted, or from the `$CWD`, and only then uses the globally installed one - so the version used
  should automatically match the one required by the project.
  Use `clang-format -version` in case you get confused.
* Use `gulp enforce-format` to check if your code is `clang-format` clean. This also gives
  you a command line to format your code.
* `clang-format` also includes a git hook, run `git clang-format` to format all files you
  touched.
* You can run this as a **git pre-commit hook** to automatically format your delta regions when you
  commit a change. In the ng-bootstrap repo, run

```
    $ echo -e '#!/bin/sh\nexec git clang-format' > .git/hooks/pre-commit
    $ chmod u+x !$
```

* **WebStorm** can run clang-format on the current file.
  1. Under Preferences, open Tools > External Tools.
  1. Plus icon to Create Tool
  1. Fill in the form:
    - Name: clang-format
    - Description: Format
    - Synchronize files after execution: checked
    - Open console: not checked
    - Show in: Editor menu
    - Program: [path to clang-format, try `$ echo $(npm config get prefix)/bin/clang-format`]
    - Parameters: `-i -style=file $FilePath$`
    - Working directory: `$ProjectFileDir$`
* `clang-format` integrations are also available for many popular editors (`vim`, `emacs`,
  `Sublime Text`, etc.).
