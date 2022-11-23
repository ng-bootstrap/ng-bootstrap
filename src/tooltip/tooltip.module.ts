import { NgModule } from '@angular/core';

import { NgbTooltip } from './tooltip';

export { NgbTooltipConfig } from './tooltip-config';
export { NgbTooltip } from './tooltip';
export { Placement } from '../util/positioning';

@NgModule({
	imports: [NgbTooltip],
	exports: [NgbTooltip],
})
export class NgbTooltipModule {}
