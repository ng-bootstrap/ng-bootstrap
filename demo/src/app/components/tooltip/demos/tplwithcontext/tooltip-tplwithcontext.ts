import { Component } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';

@Component({
	selector: 'ngbd-tooltip-tplwithcontext',
	imports: [NgbTooltip],
	templateUrl: './tooltip-tplwithcontext.html',
})
export class NgbdTooltipTplwithcontext {
	name = 'World';

	toggleWithGreeting(tooltip: NgbTooltip, greeting: string) {
		if (tooltip.isOpen()) {
			tooltip.close();
		} else {
			tooltip.open({ greeting });
		}
	}
}
