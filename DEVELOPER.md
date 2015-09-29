##TODO - more info

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
  commit a change. In the angular repo, run

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