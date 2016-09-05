import {NgModule} from '@angular/core';

import {NgbTooltip, NgbTooltipWindow} from './tooltip';
import {NgbTooltipConfig} from './tooltip-config';

export {NgbTooltipConfig} from './tooltip-config';

@NgModule({
  declarations: [NgbTooltip, NgbTooltipWindow],
  exports: [NgbTooltip],
  entryComponents: [NgbTooltipWindow],
  providers: [NgbTooltipConfig]
})
export class NgbTooltipModule {
}
