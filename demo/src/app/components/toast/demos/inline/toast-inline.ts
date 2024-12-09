import { Component } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-toast-inline',
    imports: [NgbToastModule],
    templateUrl: './toast-inline.html'
})
export class NgbdToastInline {
	show = true;
}
