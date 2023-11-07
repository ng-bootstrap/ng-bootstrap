import * as glob from 'glob';
import { ensureFileSync, writeFileSync } from 'fs-extra';
import { readFileSync } from 'fs';

/**
 * Extracts demo source files into 'demo/src/demos-sources.ts'
 */

const DIR = 'demo/src/app/components';
const file = 'demo/src/demos-sources.ts';

const sources = {};
const fileNames = glob.sync(`${DIR}/**/demos/**/*.{ts,html}`, { ignore: ['**/*spec.ts', '**/*routes.ts'] });

for (const fileName of fileNames) {
	sources[fileName.replace(DIR, '').substring(1)] = readFileSync(fileName, 'utf-8');
}

ensureFileSync(file);
writeFileSync(
	file,
	`export default ${JSON.stringify(sources)
		.replace(/\u2028/g, '\\u2028')
		.replace(/\u2029/g, '\\u2029')};`,
);
