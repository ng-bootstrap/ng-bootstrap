import {NgModule, ModuleWithProviders} from '@angular/core';
import {NGB_DROPDOWN_DIRECTIVES} from './dropdown';
import {NgbDropdownConfig} from './dropdown-config';

export {NgbDropdownConfig} from './dropdown-config';

@NgModule({declarations: NGB_DROPDOWN_DIRECTIVES, exports: NGB_DROPDOWN_DIRECTIVES})
export class NgbDropdownModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbDropdownModule, providers: [NgbDropdownConfig]}; }
}
