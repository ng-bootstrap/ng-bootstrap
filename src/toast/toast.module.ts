import { NgModule } from '@angular/core';

import { NgbToast, NgbToastHeader } from './toast';

export { NgbToast, NgbToastHeader } from './toast';
export { NgbToastConfig, NgbToastOptions } from './toast-config';

@NgModule({
	imports: [NgbToast, NgbToastHeader],
	exports: [NgbToast, NgbToastHeader],
})
export class NgbToastModule {}
