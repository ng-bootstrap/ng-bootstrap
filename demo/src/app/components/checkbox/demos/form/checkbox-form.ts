import {Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({selector: 'ngbd-checkbox-form', templateUrl: './checkbox-form.html'})
export class NgbdCheckboxForm {
  ctrl = new FormControl(false, Validators.requiredTrue);

  toggle() {
    if (this.ctrl.disabled) {
      this.ctrl.enable();
    } else {
      this.ctrl.disable();
    }
  }
}
