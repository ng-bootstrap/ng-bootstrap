import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'ngbd-buttons-checkboxreactive',
  templateUrl: './buttons-checkboxreactive.html'
})
export class NgbdButtonsCheckboxreactive {
  public checkboxGroupForm: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.checkboxGroupForm = formBuilder.group({
      left: true,
      middle: false,
      right: false
    });
  }
}
