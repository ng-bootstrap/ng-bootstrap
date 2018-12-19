import {readJSONSync, writeJSONSync, copyFileSync} from 'fs-extra';

const DIST_ROOT = 'dist/ng-bootstrap';
const PACKAGE_JSON = `${DIST_ROOT}/package.json`;

// 1. Copying missing required static assets after the ng-bootstap build
['LICENSE', 'README.md'].forEach(file => copyFileSync(file, `${DIST_ROOT}/${file}`));

// 2. Patching 'package.json', using ESM instead of FESM by default
const packageJson = readJSONSync(PACKAGE_JSON);

packageJson['module'] = 'esm5/ng-bootstrap.js';
packageJson['es2015'] = 'esm2015/ng-bootstrap.js';

writeJSONSync(PACKAGE_JSON, packageJson, {spaces: 2});
