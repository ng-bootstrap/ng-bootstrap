import { Component } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-popover-container',
	standalone: true,
	imports: [NgbPopoverModule],
	templateUrl: './popover-container.html',
	styles: ['.card { overflow: hidden }'],
})
export class NgbdPopoverContainer {}
