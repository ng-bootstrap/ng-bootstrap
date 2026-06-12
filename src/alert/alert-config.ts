import { inject, Injectable } from '@angular/core';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';
import { Subject } from 'rxjs';

/**
 * A configuration service for the [NgbAlert](#/components/alert/api#NgbAlert) component.
 *
 * You can inject this service, typically in your root component, and customize its properties
 * to provide default values for all alerts used in the application.
 */
@Injectable({ providedIn: 'root' })
export class NgbAlertConfig {
	/**
	 * Stream to emit from when config is changed.
	 * Use this to notify components to trigger change detection
	 */
	readonly changes: Subject<void> = new Subject<void>();

	private _ngbConfig = inject(NgbConfig);
	private _animation: boolean;

	closeLabel = $localize`:@@ngb.alert.close:Close`;

	dismissible = true;
	type = 'warning';

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
