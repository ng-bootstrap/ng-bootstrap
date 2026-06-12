import { Component } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover';

@Component({
	selector: 'popover-component',
	imports: [NgbPopover],
	template: `
		<button type="button" class="btn btn-outline-secondary" ngbPopover="Hello" popoverTitle="Popover">Click me</button>
	`,
})
export class PopoverComponent {}
