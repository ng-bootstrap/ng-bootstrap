const fs = require('fs');

/*
  Let's get widget names as valid list of scopes.
  Adding also demo & demos as valid too.
*/
const scopes = [
  "demo", "demos", ...fs.readdirSync("./src", {withFileTypes: true})
                       .filter(d => d.isDirectory())
                       .filter(d => !["test", "util"].includes(d.name))
                       .map(d => d.name)
];

module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {"scope-enum": [2, 'always', scopes]}
};
