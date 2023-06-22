import { Component } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'popover-component',
	standalone: true,
	imports: [NgbPopoverModule],
	template: `
		<button type="button" class="btn btn-outline-secondary" ngbPopover="Hello" popoverTitle="Popover">Click me</button>
	`,
})
export class PopoverComponent {}
