import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbTimepicker} from './timepicker';
import {NgbTimeAdapter, NgbTimeStructAdapter} from './ngb-time-adapter';

export {NgbTimepicker} from './timepicker';
export {NgbTimepickerConfig} from './timepicker-config';
export {NgbTimeStruct} from './ngb-time-struct';
export {NgbTimeAdapter} from './ngb-time-adapter';

@NgModule({
  declarations: [NgbTimepicker],
  exports: [NgbTimepicker],
  imports: [CommonModule],
  providers: [{provide: NgbTimeAdapter, useClass: NgbTimeStructAdapter}]
})
export class NgbTimepickerModule {
  /**
   * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
   * Will be removed in 4.0.0.
   *
   * @deprecated 3.0.0
   */
  static forRoot(): ModuleWithProviders { return {ngModule: NgbTimepickerModule}; }
}
