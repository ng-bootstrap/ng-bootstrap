import {Injectable, Inject, InjectionToken, OnDestroy} from '@angular/core';
import {DOCUMENT} from '@angular/common';



// usefulness (and default value) of delay documented in Material's CDK
// https://github.com/angular/material2/blob/6405da9b8e8532a7e5c854c920ee1815c275d734/src/cdk/a11y/live-announcer/live-announcer.ts#L50
export type ARIA_LIVE_DELAY_TYPE = number | null;
export const ARIA_LIVE_DELAY = new InjectionToken<ARIA_LIVE_DELAY_TYPE>('live announcer delay');
export const DEFAULT_ARIA_LIVE_DELAY: ARIA_LIVE_DELAY_TYPE = 100;



function createLiveElement(document): HTMLElement {
  const element = document.createElement('div');

  element.setAttribute('aria-live', 'polite');
  element.setAttribute('aria-atomic', 'true');

  element.classList.add('sr-only');

  document.body.appendChild(element);

  return element;
}



@Injectable()
export class Live implements OnDestroy {
  private _element: HTMLElement;

  constructor(@Inject(DOCUMENT) document: any, @Inject(ARIA_LIVE_DELAY) private _delay: ARIA_LIVE_DELAY_TYPE) {
    this._element = createLiveElement(document);
  }

  ngOnDestroy() { this._element.parentElement.removeChild(this._element); }

  say(message: string): void {
    const element = this._element;
    const delay = this._delay;

    element.textContent = '';
    const setText = () => element.textContent = message;
    if (delay === null) {
      setText();
    } else {
      setTimeout(setText, delay);
    }
  }
}
