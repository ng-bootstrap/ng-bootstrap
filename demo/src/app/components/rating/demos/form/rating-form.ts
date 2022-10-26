import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';

@Component({
	selector: 'ngbd-rating-form',
	standalone: true,
	imports: [NgbRatingModule, ReactiveFormsModule, NgIf],
	templateUrl: './rating-form.html',
})
export class NgbdRatingForm {
	ctrl = new FormControl<number | null>(null, Validators.required);

	toggle() {
		if (this.ctrl.disabled) {
			this.ctrl.enable();
		} else {
			this.ctrl.disable();
		}
	}
}
