import { NgModule } from '@angular/core';

import { NgbProgressbar, NgbProgressbarStacked } from './progressbar';

export { NgbProgressbar, NgbProgressbarStacked } from './progressbar';
export { NgbProgressbarConfig } from './progressbar-config';

@NgModule({
	imports: [NgbProgressbar, NgbProgressbarStacked],
	exports: [NgbProgressbar, NgbProgressbarStacked],
})
export class NgbProgressbarModule {}
