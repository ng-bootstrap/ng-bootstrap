import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-nav-dynamic',
    imports: [NgbNavModule],
    templateUrl: './nav-dynamic.html',
    styles: `
		.close {
			font-size: 1.4rem;
			opacity: 0.1;
			transition: opacity 0.3s;
		}
		.nav-link:hover > .close {
			opacity: 0.8;
		}
	`
})
export class NgbdNavDynamic {
	navs = [1, 2, 3, 4, 5];
	counter = this.navs.length + 1;
	active: number;

	close(event: MouseEvent, toRemove: number) {
		this.navs = this.navs.filter((id) => id !== toRemove);
		event.preventDefault();
		event.stopImmediatePropagation();
	}

	add(event: MouseEvent) {
		this.navs.push(this.counter++);
		event.preventDefault();
	}
}
