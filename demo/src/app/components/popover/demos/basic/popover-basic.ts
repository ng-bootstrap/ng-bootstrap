import {Component} from '@angular/core';
import {NGB_POPOVER_DIRECTIVES, NgbPopoverWindow} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-popover-basic',
  template: require('./popover-basic.html'),
  directives: [NGB_POPOVER_DIRECTIVES],
  precompile: [NgbPopoverWindow]
})
export class NgbdPopoverBasic {
}
