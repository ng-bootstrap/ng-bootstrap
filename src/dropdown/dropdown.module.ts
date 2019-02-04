import {NgModule, ModuleWithProviders} from '@angular/core';
import {NgbDropdown, NgbDropdownAnchor, NgbDropdownToggle, NgbDropdownMenu} from './dropdown';

export {NgbDropdown, NgbDropdownAnchor, NgbDropdownToggle, NgbDropdownMenu} from './dropdown';
export {NgbDropdownConfig} from './dropdown-config';

const NGB_DROPDOWN_DIRECTIVES = [NgbDropdown, NgbDropdownAnchor, NgbDropdownToggle, NgbDropdownMenu];

@NgModule({declarations: NGB_DROPDOWN_DIRECTIVES, exports: NGB_DROPDOWN_DIRECTIVES})
export class NgbDropdownModule {
  /**
   * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
   * Will be removed in 4.0.0.
   *
   * @deprecated 3.0.0
   */
  static forRoot(): ModuleWithProviders { return {ngModule: NgbDropdownModule}; }
}
