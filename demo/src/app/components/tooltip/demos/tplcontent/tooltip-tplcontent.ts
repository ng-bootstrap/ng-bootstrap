import { Component } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-tooltip-tplcontent',
	standalone: true,
	imports: [NgbTooltipModule],
	templateUrl: './tooltip-tplcontent.html',
})
export class NgbdTooltipTplcontent {
	name = 'World';
}
