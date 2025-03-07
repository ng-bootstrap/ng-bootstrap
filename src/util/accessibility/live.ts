import { inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export const ARIA_LIVE_DELAY = new InjectionToken<number | null>('live announcer delay', {
	factory: () => 100,
});

export const LIVE_CONTAINER = new InjectionToken<HTMLElement | null>('live container', {
	factory: () => null,
});

function getLiveElement(document: any, container: HTMLElement, lazyCreate = false): HTMLElement | null {
	let element = container.querySelector('#ngb-live') as HTMLElement;

	if (element == null && lazyCreate) {
		element = document.createElement('div');

		element.setAttribute('id', 'ngb-live');
		element.setAttribute('aria-live', 'polite');
		element.setAttribute('aria-atomic', 'true');

		element.classList.add('visually-hidden');

		container.appendChild(element);
	}

	return element;
}

@Injectable()
export class Live implements OnDestroy {
	private _document = inject(DOCUMENT);
	private _delay = inject(ARIA_LIVE_DELAY);
	private _container = inject(LIVE_CONTAINER) || this._document.body;

	ngOnDestroy() {
		const element = getLiveElement(this._document, this._container);
		if (element) {
			// if exists, it will always be attached to either the <body> or the overriding container provided through the LIVE_CONTAINER DI token
			element.parentElement!.removeChild(element);
		}
	}

	say(message: string) {
		const element = getLiveElement(this._document, this._container, true);
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
