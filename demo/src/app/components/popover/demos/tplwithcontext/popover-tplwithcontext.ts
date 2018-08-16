import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-popover-tplwithcontext',
  templateUrl: './popover-tplwithcontext.html'
})
export class NgbdPopoverTplwithcontext {
  name = 'World';

  toggleWithGreeting(popover, greeting: string, language: string) {
    if (popover.isOpen()) {
      popover.close();
    } else {
      popover.open({greeting, language});
    }
  }
}
