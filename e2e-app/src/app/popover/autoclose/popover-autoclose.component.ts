import {Component} from '@angular/core';

@Component({templateUrl: './popover-autoclose.component.html'})
export class PopoverAutocloseComponent {
  autoClose: boolean | 'inside' | 'outside' = true;
}
