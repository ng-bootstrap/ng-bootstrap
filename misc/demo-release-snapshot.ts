import * as fs from 'fs-extra';
import { join } from 'path';
import { spawnSync } from 'child_process';

// 0. building demo site
const { version } = fs.readJsonSync('package.json'); // ex. '12.2.1'
const majorVersion = parseInt(version.split('.')[0], 10); // ex. 12

console.log(`Building demo site for version '${version}'`);
spawnSync('yarn', ['demo:build'], { cwd: join(__dirname, '..'), stdio: 'inherit' });

// 1. Cleaning the built demo
console.log(`Removing '/releases' and 'versions.json' from the built demo`);
fs.rmSync('demo/dist/browser/releases', { recursive: true, force: true });
fs.rmSync('demo/dist/browser/versions.json', { force: true });

// 2. Patching 'demo/dist/browser/index.html' to remove it from indexing
console.log(`Patching 'demo/dist/browser/index.html' with <meta content="noindex">`);
let indexHtml = fs.readFileSync('demo/dist/browser/index.html').toString();
indexHtml = indexHtml.replace('<head>', '<head>\n    <meta name="robots" content="noindex">');
fs.writeFileSync('demo/dist/browser/index.html', indexHtml);

// 3. Moving demo to the public directory
const destination = `demo/src/public/releases/${majorVersion}.x`; // ex. 12.x
console.log(`Moving built demo to '${destination}'`);
fs.copySync('demo/dist/browser', destination, { recursive: true, overwrite: true });
