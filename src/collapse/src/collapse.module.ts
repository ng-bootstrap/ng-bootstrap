import { NgModule } from '@angular/core';
import { NgbCollapse } from './collapse';

export { NgbCollapse } from './collapse';
export { NgbCollapseConfig } from './collapse-config';

@NgModule({
	imports: [NgbCollapse],
	exports: [NgbCollapse],
})
export class NgbCollapseModule {}
