import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {Component, ViewChild} from '@angular/core';

@Component({
  selector: 'ngbd-tooltip-tplwithcontext',
  templateUrl: './tooltip-tplwithcontext.html'
})
export class NgbdTooltipTplwithcontext {
  context: {greeting?: string} = {};
  name = 'World';

  @ViewChild('t') public tooltip: NgbTooltip;

  public changeGreeting(context: any): void {
    const isOpen = this.tooltip.isOpen();
    this.tooltip.close();
    if (context.greeting !== this.context.greeting || !isOpen) {
      this.context = context;
      this.tooltip.open(context);
    }
  }
}
