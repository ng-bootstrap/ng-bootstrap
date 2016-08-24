import {NgModule} from '@angular/core';

import {NgbTooltip, NgbTooltipWindow} from './tooltip';

@NgModule({declarations: [NgbTooltip, NgbTooltipWindow], exports: [NgbTooltip], entryComponents: [NgbTooltipWindow]})
export class NgbTooltipModule {
}
