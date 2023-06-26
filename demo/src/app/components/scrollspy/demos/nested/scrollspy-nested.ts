import { Component } from '@angular/core';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-scrollspy-nested',
	standalone: true,
	imports: [NgbScrollSpyModule],
	templateUrl: './scrollspy-nested.html',
})
export class NgbdScrollSpyNested {}
