import { Component } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-tooltip-autoclose',
	standalone: true,
	imports: [NgbTooltipModule],
	templateUrl: './tooltip-autoclose.html',
})
export class NgbdTooltipAutoclose {}
