import {NgModule, ModuleWithProviders} from '@angular/core';
import {NgbSelect} from './select';
import {NgbDropdownModule} from '../dropdown/dropdown.module';
import {NgbDropdown, NgbDropdownToggle} from '../dropdown/dropdown';
import {CommonModule} from '@angular/common';

export {NgbSelect} from './select';

@NgModule({declarations: [NgbSelect], exports: [NgbSelect], imports: [CommonModule, NgbDropdownModule]})
export class NgbSelectModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbSelectModule, providers: []}; }
}
