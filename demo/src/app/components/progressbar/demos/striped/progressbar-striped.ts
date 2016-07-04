import {Component} from '@angular/core';
import {NGB_PROGRESSBAR_DIRECTIVES} from '@ng-bootstrap/progressbar';

@Component({
  selector: 'ngbd-progressbar-striped',
  template: require('./progressbar-striped.html'),
  directives: [NGB_PROGRESSBAR_DIRECTIVES]
})
export class NgbdProgressbarStriped {
}
