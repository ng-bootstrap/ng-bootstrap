import {NgModule, ModuleWithProviders} from '@angular/core';
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from './dropdown';
import {NgbDropdownConfig} from './dropdown-config';

export {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from './dropdown';
export {NgbDropdownConfig} from './dropdown-config';

const NGB_DROPDOWN_DIRECTIVES = [NgbDropdownMenu, NgbDropdownToggle, NgbDropdown];

@NgModule({declarations: NGB_DROPDOWN_DIRECTIVES, exports: NGB_DROPDOWN_DIRECTIVES})
export class NgbDropdownModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbDropdownModule, providers: [NgbDropdownConfig]}; }
}
