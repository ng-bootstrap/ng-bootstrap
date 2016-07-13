import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-checkbox-basic',
  templateUrl: './checkbox-basic.html'
})
export class NgbdCheckboxBasic {
  model = {
    left: true,
    middle: false,
    right: false
  };
}
