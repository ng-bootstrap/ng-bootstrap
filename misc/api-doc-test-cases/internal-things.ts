import { Component, Directive } from '@angular/core';

/**
 * An internal component
 *
 * @internal
 */
@Component({
	selector: 'a-component',
	template: ``
})
export class InternalComponent {
}

/**
 * An internal directive
 *
 * @internal
 */
@Directive({
	selector: 'a-directive',
})
export class InternalDirective {
}

/**
 * An internal interface
 *
 * @internal
 */
export interface InternalInterface {
}

/**
 * An internal service
 *
 * @internal
 */
@Service()
export class InternalService {
}
