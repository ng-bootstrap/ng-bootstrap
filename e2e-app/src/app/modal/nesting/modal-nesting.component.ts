import { Component, TemplateRef } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
    imports: [FormsModule, NgbModule],
    templateUrl: './modal-nesting.component.html'
})
export class ModalNestingComponent {
	container: string | null = null;

	constructor(private modalService: NgbModal) {}

	openModal(content: TemplateRef<any>) {
		this.modalService.open(content);
	}

	search = (text$: Observable<string>) => text$.pipe(map(() => ['one', 'two', 'three']));
}
