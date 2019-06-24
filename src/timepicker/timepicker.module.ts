import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbTimepicker} from './timepicker';

export {NgbTimepicker} from './timepicker';
export {NgbTimepickerConfig} from './timepicker-config';
export {NgbTimeStruct} from './ngb-time-struct';
export {NgbTimeAdapter} from './ngb-time-adapter';

@NgModule({declarations: [NgbTimepicker], exports: [NgbTimepicker], imports: [CommonModule]})
export class NgbTimepickerModule {
}
