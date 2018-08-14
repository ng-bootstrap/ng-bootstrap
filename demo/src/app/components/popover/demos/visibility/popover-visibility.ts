import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-popover-visibility',
  templateUrl: './popover-visibility.html'
})
export class NgbdPopoverVisibility {
  lastShown: Date;
  lastHidden: Date;

  recordShown() {
    this.lastShown = new Date();
  }

  recordHidden() {
    this.lastHidden = new Date();
  }
}
