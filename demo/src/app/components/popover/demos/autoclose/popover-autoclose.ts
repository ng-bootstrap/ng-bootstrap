import { Component } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-popover-autoclose',
	standalone: true,
	imports: [NgbPopoverModule],
	templateUrl: './popover-autoclose.html',
})
export class NgbdPopoverAutoclose {}
