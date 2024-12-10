import { Component } from '@angular/core';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'ngbd-scrollspy-items',
	imports: [NgbScrollSpyModule, FormsModule, RouterLink],
	templateUrl: './scrollspy-items.html',
})
export class NgbdScrollSpyItems {}
