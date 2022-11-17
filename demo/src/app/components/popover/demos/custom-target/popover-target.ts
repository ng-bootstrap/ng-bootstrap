import { Component } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-popover-target',
	standalone: true,
	imports: [NgbPopoverModule],
	templateUrl: './popover-target.html',
})
export class NgbdPopoverTarget {}
