import { Component } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-tooltip-container',
	imports: [NgbTooltipModule],
	templateUrl: './tooltip-container.html',
	styles: '.card { overflow:hidden }',
})
export class NgbdTooltipContainer {}
