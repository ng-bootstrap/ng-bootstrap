import {Component} from '@angular/core';
import {NGB_POPOVER_DIRECTIVES, NgbPopoverWindow} from '@ng-bootstrap/popover';

@Component({
  selector: 'ngbd-popover-tplcontent',
  template: require('./popover-tplcontent.html'),
  directives: [NGB_POPOVER_DIRECTIVES],
  precompile: [NgbPopoverWindow]
})
export class NgbdPopoverTplcontent {
  name = 'World';
}
