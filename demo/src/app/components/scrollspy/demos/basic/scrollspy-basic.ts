import { Component } from '@angular/core';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

@Component({
	selector: 'ngbd-scrollspy-basic',
	standalone: true,
	imports: [NgbScrollSpyModule, FormsModule, AsyncPipe],
	templateUrl: './scrollspy-basic.html',
})
export class NgbdScrollSpyBasic {}
