import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-tooltip-tplwithcontext',
  templateUrl: './tooltip-tplwithcontext.html'
})
export class NgbdTooltipTplwithcontext {
  name = 'World';

  toggleWithGreeting(tooltip, greeting: string) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({greeting});
    }
  }
}
