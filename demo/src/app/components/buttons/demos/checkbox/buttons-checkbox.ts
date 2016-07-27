import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-buttons-checkbox',
  templateUrl: './buttons-checkbox.html'
})
export class NgbdButtonsCheckbox {
  model = {
    left: true,
    middle: false,
    right: false
  };
}
