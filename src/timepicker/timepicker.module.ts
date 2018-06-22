import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbTimepicker} from './timepicker';
import {NgbTimepickerConfig} from './timepicker-config';
import {NgbTimeAdapter, NgbTimeStructAdapter} from './ngb-time-adapter';

export {NgbTimepicker} from './timepicker';
export {NgbTimepickerConfig} from './timepicker-config';
export {NgbTimeStruct} from './ngb-time-struct';
export {NgbTimeAdapter} from './ngb-time-adapter';

@NgModule({declarations: [NgbTimepicker], exports: [NgbTimepicker], imports: [CommonModule]})
export class NgbTimepickerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgbTimepickerModule,
      providers: [NgbTimepickerConfig, {provide: NgbTimeAdapter, useClass: NgbTimeStructAdapter}]
    };
  }
}
