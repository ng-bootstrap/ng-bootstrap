import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';

import { readWorkspace } from '@schematics/angular/utility';

import { Schema } from './schema';
import * as messages from './messages';
import { addPackageToPackageJson, getPackageVersionFromPackageJson } from '../utils/package-config';

const VERSIONS = {
	// automatically filled from package.json during the build
	BOOTSTRAP: '^0.0.0',
	POPPER: '^0.0.0',
};

/**
 * This is executed when `ng add @ng-bootstrap/ng-bootstrap` is run.
 * It installs all dependencies in the 'package.json' and runs 'ng-add-setup-project' schematic.
 */
export default function ngAdd(options: Schema): Rule {
	return async (tree: Tree, context: SchematicContext) => {
		// Checking that project exists
		const { project } = options;
		if (project) {
			const workspace = await readWorkspace(tree);
			const projectWorkspace = workspace.projects.get(project);

			if (!projectWorkspace) {
				throw new SchematicsException(messages.noProject(project));
			}
		}

		// Installing dependencies
		const angularCoreVersion = getPackageVersionFromPackageJson(tree, '@angular/core')!;
		const angularLocalizeVersion = getPackageVersionFromPackageJson(tree, '@angular/localize', true);

		addPackageToPackageJson(tree, 'bootstrap', VERSIONS.BOOTSTRAP);
		addPackageToPackageJson(tree, '@popperjs/core', VERSIONS.POPPER);

		if (angularLocalizeVersion === null) {
			addPackageToPackageJson(tree, '@angular/localize', angularCoreVersion, true);
		}

		context.addTask(new RunSchematicTask('ng-add-setup-project', options), [
			context.addTask(new NodePackageInstallTask()),
		]);
	};
}
