import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbSliderModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngb-slider-range',
	standalone: true,
	imports: [NgbSliderModule, ReactiveFormsModule, FormsModule],
	templateUrl: './slider-range.html',
})
export class NgbSliderRange {
	sliderControl = new FormControl([10, 40, 50, 60 , 90]);
	sliderValues = [10, 40];
}
