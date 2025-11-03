import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
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
		const tree = await runner.runSchematic('ng-add', {}, appTree);
		const { dependencies, devDependencies } = JSON.parse(tree.get('/package.json')!.content.toString());

		assert.ok(dependencies['bootstrap'], 'bootstrap should be installed');
		assert.ok(
			dependencies['@angular/localize'] || devDependencies['@angular/localize'],
			'@angular/localize should be installed',
		);
		assert.ok(dependencies['@popperjs/core'], '@popperjs/core should be installed');
	});

	it(`should report when specified 'project' is not found`, async () => {
		let message = '';
		try {
			await runner.runSchematic('ng-add', { project: 'test' }, appTree);
		} catch (e) {
			message = (e as Error).message;
		} finally {
			assert.strictEqual(message, messages.noProject('test'));
		}
	});
});
