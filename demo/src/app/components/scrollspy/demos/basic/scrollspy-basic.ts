import { Component } from '@angular/core';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'ngbd-scrollspy-basic',
	standalone: true,
	imports: [NgbScrollSpyModule, FormsModule],
	templateUrl: './scrollspy-basic.html',
})
export class NgbdScrollSpyBasic {}
