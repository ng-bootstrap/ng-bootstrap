const pkg = require("../package.json");
const typescript = require("@rollup/plugin-typescript");
const replace = require("@rollup/plugin-replace");
const path = require("path");

const version = (str) => JSON.stringify(str.startsWith("^") ? str : "^" + str);

module.exports = [
  {
    output: {
      dir: path.join(__dirname, "dist"),
      format: "cjs",
      exports: "named",
    },
    input: {
      "ng-add/index": path.join(__dirname, "ng-add/index.ts"),
      "ng-add/setup-project": path.join(__dirname, "ng-add/setup-project.ts"),
    },
    external: (dependency) =>
      !(
        dependency.startsWith("./") ||
        dependency.startsWith("../") ||
        dependency.startsWith(__dirname)
      ),
    plugins: [
      replace({
        preventAssignment: true,
        "VERSIONS.NGBOOTSTRAP": version(pkg.version),
        "VERSIONS.BOOTSTRAP": version(pkg.devDependencies.bootstrap),
        "VERSIONS.POPPER": version(pkg.devDependencies["@popperjs/core"]),
      }),
      typescript({
        tsconfig: path.join(__dirname, "tsconfig.rollup.json"),
      }),
    ],
  },
];
