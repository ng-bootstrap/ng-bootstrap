import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'ngbd-buttons-checkbox-reactive',
  templateUrl: './buttons-checkbox-reactive.html'
})
export class NgbdButtonsCheckboxReactive {
  public checkboxGroupForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.checkboxGroupForm = this.formBuilder.group({
      left: true,
      middle: false,
      right: false
    });
  }
}
