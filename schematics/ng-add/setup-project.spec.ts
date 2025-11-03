import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { readWorkspace } from '@schematics/angular/utility';
import { Schema } from './schema';
import * as messages from './messages';
import { createTestApp } from '../utils/testing';
import { describe, it } from 'node:test';
import assert from 'node:assert';

for (const projectName of ['app', 'second-app']) {
	describe(`ng-add-project-setup, app=${projectName}`, () => {
		async function createApp(appOptions = {}) {
			let log: string[] = [];
			const options: Schema = { project: projectName };

			let runner = new SchematicTestRunner('schematics', require.resolve('../collection.json'));
			runner.logger.subscribe(({ message }) => log.push(message));

			let tree = await createTestApp(runner, appOptions);
			tree = await runner.runSchematic('ng-add-setup-project', options, tree);
			const workspace = await readWorkspace(tree);
			const project = workspace.projects.get(projectName)!;
			return { tree, project, runner, log };
		}

		it(`should setup standalone project correctly by default`, async () => {
			let { tree, project } = await createApp({ standalone: true });

			// localize polyfill was executed
			assert.ok(tree.read(`projects/${projectName}/tsconfig.app.json`)!.toString().includes('@angular/localize'));

			// default styles were added
			assert.ok(
				project.targets
					.get('build')!
					.options!.styles!.toString()
					.includes('node_modules/bootstrap/dist/css/bootstrap.min.css'),
			);
		});

		it(`should setup module-based project correctly by default`, async () => {
			let { tree, project } = await createApp({ standalone: false });

			// localize polyfill was executed
			assert.ok(tree.read(`projects/${projectName}/tsconfig.app.json`)!.toString().includes('@angular/localize'));

			// default styles were added
			assert.ok(
				project.targets
					.get('build')!
					.options!.styles!.toString()
					.includes('node_modules/bootstrap/dist/css/bootstrap.min.css'),
			);

			// NgbModule was imported
			let appModuleFile = tree.read(`projects/${projectName}/src/app/app.module.ts`)!.toString();
			assert.ok(appModuleFile.includes(`import { NgbModule } from '@ng-bootstrap/ng-bootstrap';`));
			assert.match(appModuleFile, /imports:\s*\[[^\]]+NgbModule[^\]]+]/m);
		});

		describe('with different style options', () => {
			for (let standalone of [false, true]) {
				it(`should patch 'style.sass' when using SASS styles (standalone=${standalone})`, async () => {
					const { tree } = await createApp({ standalone, style: 'sass' });

					const stylesFile = tree.read(`projects/${projectName}/src/styles.sass`)!.toString();
					assert.ok(stylesFile.includes(`@import 'bootstrap/scss/bootstrap'`));
					assert.ok(!stylesFile.includes(`@import 'bootstrap/scss/bootstrap;'`));
				});

				it(`should patch 'style.scss' when using SCSS styles`, async () => {
					const { tree } = await createApp({ standalone, style: 'scss' });

					assert.ok(
						tree
							.read(`projects/${projectName}/src/styles.scss`)!
							.toString()
							.includes(`@import 'bootstrap/scss/bootstrap';`),
					);
				});

				it(`should add 'bootstrap.min.css' to 'angular.json' if style system is unsupported`, async () => {
					const { project, log } = await createApp({ standalone, style: 'less' });
					assert.ok(
						project.targets
							.get('build')!
							.options!.styles!.toString()
							.includes('node_modules/bootstrap/dist/css/bootstrap.min.css'),
					);
					assert.ok(log.includes(messages.unsupportedStyles(`projects/${projectName}/src/styles.less`)));
				});
			}
		});
	});
}
