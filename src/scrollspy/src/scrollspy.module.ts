import { NgModule } from '@angular/core';

import { NgbScrollSpy, NgbScrollSpyFragment, NgbScrollSpyItem, NgbScrollSpyMenu } from './scrollspy';

export { NgbScrollSpy, NgbScrollSpyItem, NgbScrollSpyFragment, NgbScrollSpyMenu } from './scrollspy';
export { NgbScrollSpyConfig } from './scrollspy-config';
export { NgbScrollSpyService, NgbScrollSpyProcessChanges } from './scrollspy.service';

@NgModule({
	imports: [NgbScrollSpy, NgbScrollSpyItem, NgbScrollSpyFragment, NgbScrollSpyMenu],
	exports: [NgbScrollSpy, NgbScrollSpyItem, NgbScrollSpyFragment, NgbScrollSpyMenu],
})
export class NgbScrollSpyModule {}
