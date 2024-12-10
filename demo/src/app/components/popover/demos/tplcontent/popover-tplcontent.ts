import { Component } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-popover-tplcontent',
	imports: [NgbPopoverModule],
	templateUrl: './popover-tplcontent.html',
})
export class NgbdPopoverTplcontent {
	name = 'World';
}
