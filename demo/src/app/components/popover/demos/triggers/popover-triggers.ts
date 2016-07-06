import {Component} from '@angular/core';
import {NGB_POPOVER_DIRECTIVES, NgbPopoverWindow} from '@ng-bootstrap/popover';

@Component({
  selector: 'ngbd-popover-triggers',
  template: require('./popover-triggers.html'),
  directives: [NGB_POPOVER_DIRECTIVES],
  precompile: [NgbPopoverWindow]
})
export class NgbdPopoverTriggers {
}
