import {copyFileSync} from 'fs';

/**
 * Copies missing required static assets after the ng-bootstap build
 */

['LICENSE', 'README.md'].forEach(file => copyFileSync(file, `dist/ng-bootstrap/${file}`));
