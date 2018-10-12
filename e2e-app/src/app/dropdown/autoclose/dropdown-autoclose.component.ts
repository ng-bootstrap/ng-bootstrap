import {Component} from '@angular/core';

@Component({templateUrl: './dropdown-autoclose.component.html'})
export class DropdownAutoCloseComponent {
  autoClose: boolean | 'inside' | 'outside' = true;
}
