import { NgModule } from '@angular/core';
import {
	NgbDropdown,
	NgbDropdownAnchor,
	NgbDropdownToggle,
	NgbDropdownMenu,
	NgbDropdownItem,
	NgbDropdownButtonItem,
} from './dropdown';

export {
	NgbDropdown,
	NgbDropdownAnchor,
	NgbDropdownToggle,
	NgbDropdownMenu,
	NgbDropdownItem,
	NgbDropdownButtonItem,
	// eslint-disable-next-line deprecation/deprecation
	NgbNavbar,
} from './dropdown';
export { NgbDropdownConfig } from './dropdown-config';

const NGB_DROPDOWN_DIRECTIVES = [
	NgbDropdown,
	NgbDropdownAnchor,
	NgbDropdownToggle,
	NgbDropdownMenu,
	NgbDropdownItem,
	NgbDropdownButtonItem,
];

@NgModule({
	imports: NGB_DROPDOWN_DIRECTIVES,
	exports: NGB_DROPDOWN_DIRECTIVES,
})
export class NgbDropdownModule {}
