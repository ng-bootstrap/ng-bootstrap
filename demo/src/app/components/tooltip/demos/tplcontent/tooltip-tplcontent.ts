import { Component } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';

@Component({
	selector: 'ngbd-tooltip-tplcontent',
	imports: [NgbTooltip],
	templateUrl: './tooltip-tplcontent.html',
})
export class NgbdTooltipTplcontent {
	name = 'World';
}
