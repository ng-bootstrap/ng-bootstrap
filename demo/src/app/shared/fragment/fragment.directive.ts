import { Directive, Input } from '@angular/core';

@Directive({
	standalone: true,
	selector: 'a[ngbdFragment]',
	host: {
		'[class.title-fragment]': 'true',
		'[attr.id]': 'fragment',
	},
})
export class NgbdFragment {
	@Input() fragment: string;
}
