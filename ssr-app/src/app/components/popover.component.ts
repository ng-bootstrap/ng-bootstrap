import { Component } from '@angular/core';
import { NgbPopoverModule } from '@bugsplat/ng-bootstrap';

@Component({
	selector: 'popover-component',
	imports: [NgbPopoverModule],
	template: `
		<button type="button" class="btn btn-outline-secondary" ngbPopover="Hello" popoverTitle="Popover">Click me</button>
	`,
})
export class PopoverComponent {}
