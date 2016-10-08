import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbTimepicker} from './timepicker';
import {NgbTimepickerConfig} from './timepicker-config';

export {NgbTimepicker} from './timepicker';
export {NgbTimepickerConfig} from './timepicker-config';
export {NgbTimeStruct} from './ngb-time-struct';

@NgModule({declarations: [NgbTimepicker], exports: [NgbTimepicker], imports: [CommonModule]})
export class NgbTimepickerModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbTimepickerModule, providers: [NgbTimepickerConfig]}; }
}
