import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbSliderModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngb-slider-range',
	standalone: true,
	imports: [NgbSliderModule, ReactiveFormsModule, FormsModule],
	templateUrl: './slider-range.component.html',
})
export class SliderRangeComponent {
	sliderControl = new FormControl([30, 60]);
}
