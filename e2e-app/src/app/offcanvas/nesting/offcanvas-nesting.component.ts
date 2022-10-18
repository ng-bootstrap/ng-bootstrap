import { Component, TemplateRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({ templateUrl: './offcanvas-nesting.component.html' })
export class OffcanvasNestingComponent {
	constructor(private offcanvasService: NgbOffcanvas) {}

	openOffcanvas(content: TemplateRef<any>) {
		this.offcanvasService.open(content);
	}

	search = (text$: Observable<string>) => text$.pipe(map(() => ['one', 'two', 'three']));
}
