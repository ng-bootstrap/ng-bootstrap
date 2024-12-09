import { Component } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-popover-basic',
    imports: [NgbPopoverModule],
    templateUrl: './popover-basic.html',
    host: { class: 'd-block' }
})
export class NgbdPopoverBasic {}
