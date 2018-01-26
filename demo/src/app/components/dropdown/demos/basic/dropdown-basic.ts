import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-dropdown-basic',
  templateUrl: './dropdown-basic.html'
})
export class NgbdDropdownBasic {
    public onClick(message: string) {
        console.log(message);
    }
}
