import {Component} from '@angular/core';
import {NGB_TOOLTIP_DIRECTIVES, NgbTooltipWindow} from '@ng-bootstrap/tooltip';

@Component({
  selector: 'ngbd-tooltip-tplcontent',
  template: require('./tooltip-tplcontent.html'),
  directives: [NGB_TOOLTIP_DIRECTIVES],
  precompile: [NgbTooltipWindow]
})
export class NgbdTooltipTplcontent {
  name = 'World';
}
