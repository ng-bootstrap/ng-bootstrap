import { Component } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-tooltip-basic',
	standalone: true,
	imports: [NgbTooltipModule],
	templateUrl: './tooltip-basic.html',
	host: { class: 'd-block' },
})
export class NgbdTooltipBasic {}
