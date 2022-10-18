import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { getFileContent } from '@schematics/angular/utility/test/get-file-content';

import { createTestApp } from '../utils/testing';
import * as messages from './messages';

describe(`ng add '@ng-bootstrap/ng-bootstrap'`, () => {
	let runner: SchematicTestRunner;
	let appTree: Tree;

	beforeEach(async () => {
		runner = new SchematicTestRunner('schematics', require.resolve('../collection.json'));
		appTree = await createTestApp(runner);
	});

	it(`should add missing dependencies to 'package.json'`, async () => {
		const tree = await runner.runSchematicAsync('ng-add', {}, appTree).toPromise();
		const { dependencies, devDependencies } = JSON.parse(getFileContent(tree, '/package.json'));

		expect(dependencies['bootstrap']).withContext('bootstrap should be installed').toBeDefined();
		expect(dependencies['@angular/localize'] || devDependencies['@angular/localize'])
			.withContext('@angular/localize should be installed')
			.toBeDefined();
		expect(dependencies['@popperjs/core']).withContext('@popperjs/core should be installed').toBeDefined();
	});

	it(`should report when specified 'project' is not found`, async () => {
		let message = '';
		try {
			await runner.runSchematicAsync('ng-add', { project: 'test' }, appTree).toPromise();
		} catch (e) {
			message = (e as Error).message;
		} finally {
			expect(message).toBe(messages.noProject('test'));
		}
	});
});
