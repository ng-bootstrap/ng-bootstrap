import { inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export const ARIA_LIVE_DELAY = new InjectionToken<number | null>('live announcer delay', {
	providedIn: 'root',
	factory: () => 100,
});

function getLiveElement(document: any, lazyCreate = false): HTMLElement | null {
	let element = document.body.querySelector('#ngb-live') as HTMLElement;

	if (element == null && lazyCreate) {
		element = document.createElement('div');

		element.setAttribute('id', 'ngb-live');
		element.setAttribute('aria-live', 'polite');
		element.setAttribute('aria-atomic', 'true');

		element.classList.add('visually-hidden');

		document.body.appendChild(element);
	}

	return element;
}

@Injectable({ providedIn: 'root' })
export class Live implements OnDestroy {
	private _document = inject(DOCUMENT);
	private _delay = inject(ARIA_LIVE_DELAY);

	ngOnDestroy() {
		const element = getLiveElement(this._document);
		if (element) {
			// if exists, it will always be attached to the <body>
			element.parentElement!.removeChild(element);
		}
	}

	say(message: string) {
		const element = getLiveElement(this._document, true);
		const delay = this._delay;

		if (element != null) {
			element.textContent = '';
			const setText = () => (element.textContent = message);
			if (delay === null) {
				setText();
			} else {
				setTimeout(setText, delay);
			}
		}
	}
}
