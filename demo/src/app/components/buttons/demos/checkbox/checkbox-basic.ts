import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-checkbox-basic',
  template: require('./checkbox-basic.html')
})
export class NgbdCheckboxBasic {
  model = {
    left: true,
    middle: false,
    right: false
  }
}
