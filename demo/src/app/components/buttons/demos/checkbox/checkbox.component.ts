import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-buttons-checkbox',
  template: require('./checkbox.html')
})
export class NgbdButtonsCheckbox {
  model = {
    left: true,
    middle: false,
    right: false
  }
}
