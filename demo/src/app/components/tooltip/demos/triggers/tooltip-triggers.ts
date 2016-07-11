import {Component} from '@angular/core';
import {NGB_TOOLTIP_DIRECTIVES, NgbTooltipWindow} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-tooltip-triggers',
  templateUrl: './tooltip-triggers.html',
  directives: [NGB_TOOLTIP_DIRECTIVES],
  precompile: [NgbTooltipWindow]
})
export class NgbdTooltipTriggers {
}
