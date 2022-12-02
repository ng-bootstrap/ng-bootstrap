import { Component } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-tooltip-tplwithcontext',
	standalone: true,
	imports: [NgbTooltipModule],
	templateUrl: './tooltip-tplwithcontext.html',
})
export class NgbdTooltipTplwithcontext {
	name = 'World';

	toggleWithGreeting(tooltip, greeting: string) {
		if (tooltip.isOpen()) {
			tooltip.close();
		} else {
			tooltip.open({ greeting });
		}
	}
}
