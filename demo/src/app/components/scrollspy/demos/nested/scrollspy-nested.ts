import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
	NgbScrollSpy,
	NgbScrollSpyItem,
	NgbScrollSpyFragment,
	NgbScrollSpyMenu,
} from '@ng-bootstrap/ng-bootstrap/scrollspy';

@Component({
	selector: 'ngbd-scrollspy-nested',
	imports: [NgbScrollSpy, NgbScrollSpyItem, NgbScrollSpyFragment, NgbScrollSpyMenu],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './scrollspy-nested.html',
})
export class NgbdScrollSpyNested {}
