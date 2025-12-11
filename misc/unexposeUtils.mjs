import { writeFile, readFile, rm, readdir } from 'fs/promises';
import { join } from 'path';

const root = join(import.meta.dirname, '../dist/ng-bootstrap');

// delete utils folder (it only contains a package.json file which we don't need)
await rm(join(root, 'utils'), { recursive: true, force: true });

// remove utils export from main package.json
const mainPackageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf-8'));
delete mainPackageJson.exports['./utils'];

await writeFile(join(root, 'package.json'), JSON.stringify(mainPackageJson, null, 2) + '\n', 'utf-8');

// rename file types/ng-bootstrap-ng-bootstrap-utils.d.ts into types/_ngb-ngbootstrap-utilities.d.ts
await writeFile(
	join(root, 'types/_ngb-ngbootstrap-utilities.d.ts'),
	await readFile(join(root, 'types/ng-bootstrap-ng-bootstrap-utils.d.ts'), 'utf-8'),
	'utf-8',
);
await rm(join(root, 'types/ng-bootstrap-ng-bootstrap-utils.d.ts'));

// in all files in the types folder, replace imports from 'ng-bootstrap/utils' to 'ng-bootstrap/_ngb-ngbootstrap-utilities'
for (const file of await readdir(join(root, 'types'))) {
	const content = await readFile(join(root, 'types', file), 'utf-8');
	const updatedContent = content.replace(
		/from '@ng-bootstrap\/ng-bootstrap\/utils'/g,
		"from './_ngb-ngbootstrap-utilities.d'",
	);
	await writeFile(join(root, 'types', file), updatedContent, 'utf-8');
}

// rename file fesm2022/ng-bootstrap-ng-bootstrap-utils.mjs into fesm2022/_ngb-ngbootstrap-utilities.mjs
await writeFile(
	join(root, 'fesm2022/_ngb-ngbootstrap-utilities.mjs'),
	await readFile(join(root, 'fesm2022/ng-bootstrap-ng-bootstrap-utils.mjs'), 'utf-8'),
	'utf-8',
);
await rm(join(root, 'fesm2022/ng-bootstrap-ng-bootstrap-utils.mjs'));

// handle source map
await writeFile(
	join(root, 'fesm2022/_ngb-ngbootstrap-utilities.mjs.map'),
	(await readFile(join(root, 'fesm2022/ng-bootstrap-ng-bootstrap-utils.mjs.map'), 'utf-8')).replace(
		/ng-bootstrap-ng-bootstrap-utils/g,
		'_ngb-ngbootstrap-utilities',
	),
	'utf-8',
);
await rm(join(root, 'fesm2022/ng-bootstrap-ng-bootstrap-utils.mjs.map'));

// in all files in the fesm2022 folder, replace imports from 'ng-bootstrap/utils' to 'ng-bootstrap/_ngb-ngbootstrap-utilities'
for (const file of await readdir(join(root, 'fesm2022'))) {
	const content = await readFile(join(root, 'fesm2022', file), 'utf-8');
	const updatedContent = content.replace(
		/from '@ng-bootstrap\/ng-bootstrap\/utils'/g,
		"from './_ngb-ngbootstrap-utilities.mjs'",
	);
	await writeFile(join(root, 'fesm2022', file), updatedContent, 'utf-8');
}
