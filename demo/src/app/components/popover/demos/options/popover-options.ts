import { Component } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { Options } from '@popperjs/core';

@Component({
	selector: 'ngbd-popover-options',
	standalone: true,
	imports: [NgbPopoverModule],
	templateUrl: './popover-options.html',
})
export class NgbdPopoverOptions {
	popperOptions = (options: Partial<Options>) => {
		// customize placement
		options.placement = 'bottom';

		// customize modifiers
		for (const modifier of options.modifiers || []) {
			// disable flip
			if (modifier.name === 'flip') {
				modifier.enabled = false;
			}

			// customize offset
			if (modifier.name === 'offset' && modifier.options) {
				modifier.options.offset = () => [20, 20];
			}
		}

		// add your own modifier
		options.modifiers?.push({
			name: 'custom',
			enabled: true,
			phase: 'main',
			fn: ({ state }) => {
				console.log('custom modifier');
			},
		});

		// first update callback
		options.onFirstUpdate = (state) => {
			console.log('onFirstUpdate', state);
			if (state.elements?.arrow) {
				state.elements.arrow.style.display = 'none';
			}
		};
		return options;
	};
}
