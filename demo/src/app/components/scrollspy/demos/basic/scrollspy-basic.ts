import { Component } from '@angular/core';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap/scrollspy';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'ngbd-scrollspy-basic',
	imports: [NgbScrollSpyModule, FormsModule],
	templateUrl: './scrollspy-basic.html',
})
export class NgbdScrollSpyBasic {}
