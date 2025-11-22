import { Component } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap/alert';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap/nav';

@Component({
	selector: 'ngbd-nav-keep',
	imports: [NgbNavModule, NgbAlertModule],
	templateUrl: './nav-keep-content.html',
})
export class NgbdNavKeep {
	active = 1;
}
