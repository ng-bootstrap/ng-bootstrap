import {Component} from '@angular/core';
import {NGB_TOOLTIP_DIRECTIVES, NgbTooltipWindow} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-tooltip-tplcontent',
  templateUrl: './tooltip-tplcontent.html',
  directives: [NGB_TOOLTIP_DIRECTIVES],
  precompile: [NgbTooltipWindow]
})
export class NgbdTooltipTplcontent {
  name = 'World';
}
