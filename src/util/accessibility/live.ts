import { Injectable, Inject, InjectionToken } from '@angular/core';

// usefulness (and default value) of delay documented in Material's CDK
// https://github.com/angular/material2/blob/6405da9b8e8532a7e5c854c920ee1815c275d734/src/cdk/a11y/live-announcer/live-announcer.ts#L50
export type ARIA_LIVE_DELAY_TYPE = number | null;
export const ARIA_LIVE_DELAY = new InjectionToken<ARIA_LIVE_DELAY_TYPE>('live announcer delay', {
	providedIn: 'root',
	factory: ARIA_LIVE_DELAY_FACTORY,
});
export function ARIA_LIVE_DELAY_FACTORY(): number {
	return 100;
}

function getLiveElement(parentElement: HTMLElement, lazyCreate = false): HTMLElement | null {
	let element = parentElement.querySelector('#ngb-live') as HTMLElement;

	if (element == null && lazyCreate) {
		element = document.createElement('div');

		element.setAttribute('id', 'ngb-live');
		element.setAttribute('aria-live', 'polite');
		element.setAttribute('aria-atomic', 'true');

		element.classList.add('visually-hidden');

		parentElement.appendChild(element);
	}

	return element;
}

@Injectable({ providedIn: 'root' })
export class Live {
	constructor(@Inject(ARIA_LIVE_DELAY) private _delay: any) {}

	say(message: string, parentElement: HTMLElement) {
		const element = getLiveElement(parentElement, true);
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
