import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NGB_TIMEPICKER_DIRECTIVES} from './timepicker';

@NgModule({declarations: NGB_TIMEPICKER_DIRECTIVES, exports: NGB_TIMEPICKER_DIRECTIVES, imports: [CommonModule]})
export class NgbTimepickerModule {
}
