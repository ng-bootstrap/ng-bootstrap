import { NgModule } from '@angular/core';

import { NgbRating } from './rating';

export { NgbRating } from './rating';
export { NgbRatingConfig } from './rating-config';

@NgModule({
	imports: [NgbRating],
	exports: [NgbRating],
})
export class NgbRatingModule {}
