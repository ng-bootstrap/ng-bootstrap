import { NgModule } from '@angular/core';

import { NgbAlert } from './alert';

export { NgbAlert } from './alert';
export { NgbAlertConfig } from './alert-config';

@NgModule({
	imports: [NgbAlert],
	exports: [NgbAlert],
})
export class NgbAlertModule {}
