import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbSliderModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngb-slider-vertical',
	standalone: true,
	imports: [NgbSliderModule, ReactiveFormsModule, FormsModule],
	templateUrl: './slider-vertical.html',
})
export class NgbSliderVertical {
	sliderControl = new FormControl([30]);
	sliderControlRange = new FormControl([10, 50]);
}
