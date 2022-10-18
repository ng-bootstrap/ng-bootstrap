import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'ngbd-rating-form',
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
