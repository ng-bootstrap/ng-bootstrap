import { Component } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';

@Component({
	selector: 'ngbd-tooltip-container',
	imports: [NgbTooltip],
	templateUrl: './tooltip-container.html',
	styles: '.card { overflow:hidden }',
})
export class NgbdTooltipContainer {}
