import { Component } from '@angular/core';
import { NgbAlertModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-nav-keep',
    imports: [NgbNavModule, NgbAlertModule],
    templateUrl: './nav-keep-content.html'
})
export class NgbdNavKeep {
	active = 1;
}
