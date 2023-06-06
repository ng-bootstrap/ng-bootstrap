import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { readWorkspace } from '@schematics/angular/utility';
import { Schema } from './schema';
import * as messages from './messages';
import { createTestApp } from '../utils/testing';

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
			expect(tree.read(`projects/${projectName}/tsconfig.app.json`)!.toString()).toContain('@angular/localize');

			// default styles were added
			expect(project.targets.get('build')!.options!.styles).toContain(
				'node_modules/bootstrap/dist/css/bootstrap.min.css',
			);
		});

		it(`should setup module-based project correctly by default`, async () => {
			let { tree, project } = await createApp({ standalone: false });

			// localize polyfill was executed
			expect(tree.read(`projects/${projectName}/tsconfig.app.json`)!.toString()).toContain('@angular/localize');

			// default styles were added
			expect(project.targets.get('build')!.options!.styles).toContain(
				'node_modules/bootstrap/dist/css/bootstrap.min.css',
			);

			// NgbModule was imported
			let appModuleFile = tree.read(`projects/${projectName}/src/app/app.module.ts`)!.toString();
			expect(appModuleFile).toContain(`import { NgbModule } from '@ng-bootstrap/ng-bootstrap';`);
			expect(appModuleFile).toMatch(/imports:\s*\[[^\]]+NgbModule[^\]]+]/m);
		});

		describe('with different style options', () => {
			for (let standalone of [false, true]) {
				it(`should patch 'style.sass' when using SASS styles (standalone=${standalone})`, async () => {
					const { tree } = await createApp({ standalone, style: 'sass' });

					const stylesFile = tree.read(`projects/${projectName}/src/styles.sass`)!.toString();
					expect(stylesFile).toContain(`@import 'bootstrap/scss/bootstrap'`);
					expect(stylesFile).not.toContain(`@import 'bootstrap/scss/bootstrap;'`);
				});

				it(`should patch 'style.scss' when using SCSS styles`, async () => {
					const { tree } = await createApp({ standalone, style: 'scss' });

					expect(tree.read(`projects/${projectName}/src/styles.scss`)!.toString()).toContain(
						`@import 'bootstrap/scss/bootstrap';`,
					);
				});

				it(`should add 'bootstrap.min.css' to 'angular.json' if style system is unsupported`, async () => {
					const { project, log } = await createApp({ standalone, style: 'less' });
					expect(project.targets.get('build')!.options!.styles).toContain(
						'node_modules/bootstrap/dist/css/bootstrap.min.css',
					);
					expect(log).toContain(messages.unsupportedStyles(`projects/${projectName}/src/styles.less`));
				});
			}
		});
	});
}
