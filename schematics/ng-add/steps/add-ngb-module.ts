import type { Rule } from '@angular-devkit/schematics';
import { addRootImport } from '@schematics/angular/utility';

import type { Schema } from '../schema';

const NG_BOOTSTRAP_MODULE_NAME = 'NgbModule';
const NG_BOOTSTRAP_PACKAGE_NAME = '@ng-bootstrap/ng-bootstrap';

/**
 * Patches main application module by adding 'NgbModule' import.
 */
export function addNgbModuleToAppModule(options: Schema): Rule {
	return addRootImport(
		options.project!,
		({ code, external }) => code`${external(NG_BOOTSTRAP_MODULE_NAME, NG_BOOTSTRAP_PACKAGE_NAME)}`,
	) as any;
}
