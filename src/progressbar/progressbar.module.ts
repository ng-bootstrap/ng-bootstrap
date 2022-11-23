import { NgModule } from '@angular/core';

import { NgbProgressbar } from './progressbar';

export { NgbProgressbar } from './progressbar';
export { NgbProgressbarConfig } from './progressbar-config';

@NgModule({
	imports: [NgbProgressbar],
	exports: [NgbProgressbar],
})
export class NgbProgressbarModule {}
