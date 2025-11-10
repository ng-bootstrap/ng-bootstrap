import { NgModule } from '@angular/core';

import { NgbTooltip } from './tooltip';

export { NgbTooltipConfig } from './tooltip-config';
export { NgbTooltip } from './tooltip';
export { Placement } from '@ng-bootstrap/ng-bootstrap/utils';

@NgModule({
	imports: [NgbTooltip],
	exports: [NgbTooltip],
})
export class NgbTooltipModule {}
