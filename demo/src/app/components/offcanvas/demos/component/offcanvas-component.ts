import { Component, inject, input, inputBinding, model, output, outputBinding, signal, twoWayBinding } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveOffcanvas, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap/offcanvas';

@Component({
	selector: 'ngbd-offcanvas-content',
	imports: [FormsModule],
	template: `
		<div class="offcanvas-header">
			<h5 class="offcanvas-title">Offcanvas</h5>
			<button
				type="button"
				class="btn-close text-reset"
				aria-label="Close"
				(click)="activeOffcanvas.dismiss('Cross click')"
			></button>
		</div>
		<div class="offcanvas-body">
			<p>Hello, {{ name() }}!</p>

			<div class="d-flex gap-2 mb-2">
				<input class="form-control" [(ngModel)]="response" placeholder="Write a response" />
				<button class="btn btn-primary" (click)="send.emit(response())">Send</button>
			</div>

			<button type="button" class="btn btn-outline-secondary" (click)="activeOffcanvas.close('Close click')">
				Close
			</button>
		</div>
	`,
	styles: `
		/* Opening offcanvas as a component requires this style in order to scroll */
		:host {
			height: 100%;
			display: flex;
			flex-direction: column;
		}
	`,
})
export class NgbdOffcanvasContent {
	readonly activeOffcanvas = inject(NgbActiveOffcanvas);
	readonly name = input.required<string>();
	readonly response = model.required<string>();
	readonly send = output<string>();
}

@Component({
	selector: 'ngbd-offcanvas-component',
	templateUrl: './offcanvas-component.html',
})
export class NgbdOffcanvasComponent {
	private readonly offcanvasService = inject(NgbOffcanvas);

	readonly response = signal('');

	open() {
		this.offcanvasService.open(NgbdOffcanvasContent, {
			bindings: [
				inputBinding('name', () => 'World'),
				twoWayBinding('response', this.response),
				outputBinding('send', (value) => console.log('Response sent: ' + value)),
			]
		});
	}
}
