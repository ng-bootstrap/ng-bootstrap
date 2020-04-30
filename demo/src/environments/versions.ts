import {major, minor} from 'semver';

let bootstrap: string = require('../../../package.json').devDependencies['bootstrap'];
// extracts only the minor version from package.json
// ex. "bootstrap": "4.0.1" -> "4.0"
bootstrap = `${major(bootstrap)}.${minor(bootstrap)}`;

const ngBootstrap = require('../../../package.json').version;

export const versions: {[key: string]: string} = {bootstrap, ngBootstrap};
