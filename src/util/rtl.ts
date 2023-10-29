import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class NgbRTL {
	private _element = inject(DOCUMENT).documentElement;

	isRTL() {
		return (this._element.getAttribute('dir') || '').toLowerCase() === 'rtl';
	}
}
