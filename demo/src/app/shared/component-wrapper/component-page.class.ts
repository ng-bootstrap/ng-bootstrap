import { inject } from '@angular/core';
import { COMPONENT_DATA, LIB_VERSIONS, MenuItem } from '../../tokens';

export abstract class NgbdComponentPage {
	protected bootstrapVersion = inject(LIB_VERSIONS).bootstrap;
	protected component = inject(COMPONENT_DATA);

	abstract get menuItems(): MenuItem[];
}
