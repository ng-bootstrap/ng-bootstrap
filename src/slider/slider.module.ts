import { NgModule } from '@angular/core';

import { NgbSlider } from './slider';

export { NgbSlider } from './slider';
export { NgbSliderConfig } from './slider-config';

@NgModule({
	imports: [NgbSlider],
	exports: [NgbSlider],
})
export class NgbSliderModule {}
