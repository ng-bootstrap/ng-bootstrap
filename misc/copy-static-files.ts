import {copyFileSync, copySync} from 'fs-extra';

/**
 * Copies missing required static assets and schematics after the ng-bootstrap build
 */
const DEST = 'dist/ng-bootstrap';
const SCHEMATICS = `${DEST}/schematics`;

['LICENSE', 'README.md'].forEach(file => copyFileSync(file, `${DEST}/${file}`));

// Schematics
copySync('schematics/dist', SCHEMATICS);
copyFileSync('schematics/collection.json', `${SCHEMATICS}/collection.json`);
copyFileSync('schematics/ng-add/schema.json', `${SCHEMATICS}/ng-add/schema.json`);
