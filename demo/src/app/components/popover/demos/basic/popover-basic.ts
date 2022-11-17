import { Component } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-popover-basic',
	standalone: true,
	imports: [NgbPopoverModule],
	templateUrl: './popover-basic.html',
	host: { class: 'd-block' },
})
export class NgbdPopoverBasic {}
