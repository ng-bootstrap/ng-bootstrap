import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbSliderModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngb-slider-basic',
	standalone: true,
	imports: [NgbSliderModule, ReactiveFormsModule, FormsModule],
	templateUrl: './slider-basic.html',
})
export class NgbSliderBasic implements OnInit{
	sliderControl = new FormControl(60);
	disabledControl = new FormControl(60);
	value = 20;
	disabledToggle = true;
	readonlyToggle = true;

	ngOnInit() {
		this.disabledControl.disable();
	}

	handleDisabled() {
		if (this.disabledToggle) {
			this.disabledControl.disable();
		} else {
			this.disabledControl.enable();
		}
	}
}
