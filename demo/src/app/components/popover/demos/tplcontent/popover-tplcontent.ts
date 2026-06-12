import { Component } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover';

@Component({
	selector: 'ngbd-popover-tplcontent',
	imports: [NgbPopover],
	templateUrl: './popover-tplcontent.html',
})
export class NgbdPopoverTplcontent {
	name = 'World';
}
