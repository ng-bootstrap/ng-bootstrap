import {Component} from '@angular/core';

@Component({templateUrl: './tooltip-autoclose.component.html'})
export class TooltipAutocloseComponent {
  autoClose: boolean | 'inside' | 'outside' = true;
}
