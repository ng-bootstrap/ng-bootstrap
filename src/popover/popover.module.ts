import { NgModule } from '@angular/core';

import { NgbPopover } from './popover';

export { NgbPopover } from './popover';
export { NgbPopoverConfig } from './popover-config';
export { Placement } from '../util/positioning';

@NgModule({
	imports: [NgbPopover],
	exports: [NgbPopover],
})
export class NgbPopoverModule {}
