import { Injectable, Injector } from '@angular/core';
import { NgbOffcanvasConfig, NgbOffcanvasOptions } from './offcanvas-config';
import { NgbOffcanvasRef } from './offcanvas-ref';
import { NgbOffcanvasStack } from './offcanvas-stack';

/**
 * A service for opening an offcanvas.
 *
 * Creating an offcanvas is straightforward: create a component or a template and pass it as an argument to
 * the `.open()` method.
 *
 * @since 12.1.0
 */
@Injectable({ providedIn: 'root' })
export class NgbOffcanvas {
	constructor(
		private _injector: Injector,
		private _offcanvasStack: NgbOffcanvasStack,
		private _config: NgbOffcanvasConfig,
	) {}

	/**
	 * Opens a new offcanvas panel with the specified content and supplied options.
	 *
	 * Content can be provided as a `TemplateRef` or a component type. If you pass a component type as content,
	 * then instances of those components can be injected with an instance of the `NgbActiveOffcanvas` class. You can then
	 * use `NgbActiveOffcanvas` methods to close / dismiss offcanvas from "inside" of your component.
	 *
	 * Also see the [`NgbOffcanvasOptions`](#/components/offcanvas/api#NgbOffcanvasOptions) for the list of supported
	 * options.
	 */
	open(content: any, options: NgbOffcanvasOptions = {}): NgbOffcanvasRef {
		const combinedOptions = { ...this._config, animation: this._config.animation, ...options };
		return this._offcanvasStack.open(this._injector, content, combinedOptions);
	}

	/**
	 * Returns an observable that holds the active offcanvas instance.
	 */
	get activeInstance() {
		return this._offcanvasStack.activeInstance;
	}

	/**
	 * Dismisses the currently displayed offcanvas with the supplied reason.
	 */
	dismiss(reason?: any) {
		this._offcanvasStack.dismiss(reason);
	}

	/**
	 * Indicates if there is currently an open offcanvas in the application.
	 */
	hasOpenOffcanvas(): boolean {
		return this._offcanvasStack.hasOpenOffcanvas();
	}
}
