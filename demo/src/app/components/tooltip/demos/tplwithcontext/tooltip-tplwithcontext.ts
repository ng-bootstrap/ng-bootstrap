import { Component } from '@angular/core';
import { NgbTooltip, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-tooltip-tplwithcontext',
	imports: [NgbTooltipModule],
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
