const path = require("path");

const config = {
  // eslint-disable-next-line global-require
  project: path.join(__dirname, "../../tsconfig.spec.json")
};
// console.log('jasmine-ts', config);
require("ts-node").register(config);
