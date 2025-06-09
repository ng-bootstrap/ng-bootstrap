import { Component, TemplateRef } from '@angular/core';
import { NgbModule, NgbOffcanvas } from '@bugsplat/ng-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
	imports: [FormsModule, NgbModule],
	templateUrl: './offcanvas-nesting.component.html',
})
export class OffcanvasNestingComponent {
	constructor(private offcanvasService: NgbOffcanvas) {}

	openOffcanvas(content: TemplateRef<any>) {
		this.offcanvasService.open(content);
	}

	search = (text$: Observable<string>) => text$.pipe(map(() => ['one', 'two', 'three']));
}
