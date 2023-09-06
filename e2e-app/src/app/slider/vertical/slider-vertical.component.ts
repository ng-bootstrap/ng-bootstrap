import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbSliderModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngb-slider-vertical',
	standalone: true,
	imports: [NgbSliderModule, ReactiveFormsModule, FormsModule],
	templateUrl: './slider-vertical.component.html',
})
export class SliderVerticalComponent {
	sliderControl = new FormControl([30, 60]);
}
