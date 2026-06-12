import { Component } from '@angular/core';
import { NgbScrollSpy, NgbScrollSpyItem, NgbScrollSpyFragment } from '@ng-bootstrap/ng-bootstrap/scrollspy';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'ngbd-scrollspy-items',
	imports: [NgbScrollSpy, NgbScrollSpyItem, NgbScrollSpyFragment, FormsModule, RouterLink],
	templateUrl: './scrollspy-items.html',
})
export class NgbdScrollSpyItems {}
