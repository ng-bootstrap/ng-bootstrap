import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbSliderModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngb-slider-basic',
	standalone: true,
	imports: [NgbSliderModule, ReactiveFormsModule, FormsModule],
	templateUrl: './slider-basic.component.html',
})
export class SliderBasicComponent {
	sliderControl = new FormControl(60);

	disabledToggle = false;
	readonlyToggle = false;

	handleDisabled() {
		if (this.disabledToggle) {
			this.sliderControl.disable();
		} else {
			this.sliderControl.enable();
		}
	}
}
