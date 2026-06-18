import { Binding, inject, Service, Injector } from '@angular/core';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';

/**
 * Options available when opening new offcanvas windows with `NgbOffcanvas.open()` method.
 *
 * @since 12.1.0
 */
export interface NgbOffcanvasOptions {
	/**
	 * If `true`, opening and closing will be animated.
	 */
	animation?: boolean;

	/**
	 * `aria-describedby` attribute value to set on the offcanvas panel.
	 */
	ariaDescribedBy?: string;

	/**
	 * `aria-labelledby` attribute value to set on the offcanvas panel.
	 */
	ariaLabelledBy?: string;

	/**
	 * If `true`, the backdrop element will be created for a given offcanvas.
	 * If 'static', clicking the backdrop won't close the offcanvas (available since 13.1.0).
	 *
	 * Default value is `true`.
	 */
	backdrop?: boolean | 'static';

	/**
	 * A custom class to append to the offcanvas backdrop.
	 */
	backdropClass?: string;

	/**
	 * Callback right before the offcanvas will be dismissed.
	 *
	 * If this function returns:
	 * * `false`
	 * * a promise resolved with `false`
	 * * a promise that is rejected
	 *
	 * then the offcanvas won't be dismissed.
	 */
	beforeDismiss?: () => boolean | Promise<boolean>;

	/**
	 * Bind values and functions of parent component to the offcanvas component's inputs and outputs. Use Angular's
	 * [`inputBinding`](https://angular.dev/api/core/inputBinding), [`twoWayBinding`](https://angular.dev/api/core/twoWayBinding)
	 * and [`outputBinding`](https://angular.dev/api/core/outputBinding) functions.
	 *
	 * @since 22.0.0
	 *
	 * @example
	 * ```ts
	 * const response = signal('');
	 *
	 * NgbOffcanvas.open(OffcanvasComponent, {
	 *   bindings: [
	 *     inputBinding('name', () => 'World'),
	 *     twoWayBinding('response', response),
	 *     outputBinding('send', (value) => console.log('Response sent: ' + value)),
	 *   ]
	 * })
	 * ```
	 */
	bindings?: Binding[];

	/**
	 * A selector specifying the element all new offcanvas panels and backdrops should be appended to.
	 *
	 * If not specified, will be `body`.
	 */
	container?: string | HTMLElement;

	/**
	 * The `Injector` to use for offcanvas content.
	 */
	injector?: Injector;

	/**
	 * If `true`, the offcanvas will be closed when `Escape` key is pressed
	 *
	 * Default value is `true`.
	 */
	keyboard?: boolean;

	/**
	 * A custom class to append to the offcanvas panel.
	 */
	panelClass?: string;

	/**
	 * The position of the offcanvas
	 */
	position?: 'start' | 'end' | 'top' | 'bottom';

	/**
	 * Scroll content while offcanvas is open (false by default).
	 */
	scroll?: boolean;
}

/**
 * A configuration service for the [`NgbOffcanvas`](#/components/offcanvas/api#NgbOffcanvas) service.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all offcanvases used in the application.
 *
 * @since 12.1.0
 */
@Service()
export class NgbOffcanvasConfig implements Required<NgbOffcanvasOptions> {
	private _ngbConfig = inject(NgbConfig);
	private _animation: boolean;

	ariaDescribedBy: string;
	ariaLabelledBy: string;
	backdrop: boolean | 'static' = true;
	backdropClass: string;
	beforeDismiss: () => boolean | Promise<boolean>;
	bindings: Binding[];
	container: string | HTMLElement;
	injector: Injector;
	keyboard = true;
	panelClass: string;
	position: 'start' | 'end' | 'top' | 'bottom' = 'start';
	scroll = false;

	/**
	 * @defaultValue `true`
	 */
	get animation(): boolean {
		return this._animation ?? this._ngbConfig.animation;
	}
	set animation(animation: boolean) {
		this._animation = animation;
	}
}
