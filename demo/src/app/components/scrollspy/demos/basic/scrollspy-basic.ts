import { Component } from '@angular/core';
import { NgbScrollSpy, NgbScrollSpyFragment } from '@ng-bootstrap/ng-bootstrap/scrollspy';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'ngbd-scrollspy-basic',
	imports: [NgbScrollSpy, NgbScrollSpyFragment, FormsModule],
	templateUrl: './scrollspy-basic.html',
})
export class NgbdScrollSpyBasic {}
