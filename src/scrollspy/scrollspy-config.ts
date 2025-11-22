import { Injectable } from '@angular/core';
import { NgbScrollSpyProcessChanges } from './scrollspy.service';
import { defaultProcessChanges } from './scrollspy.utils';

/**
 * A configuration service for the [`NgbScrollSpyService`](#/components/scrollspy/api#NgbScrollSpyService).
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all scrollspies used in the application.
 *
 * @since 15.1.0
 */
@Injectable({ providedIn: 'root' })
export class NgbScrollSpyConfig {
	scrollBehavior: 'auto' | 'smooth' = 'smooth';
	processChanges: NgbScrollSpyProcessChanges = defaultProcessChanges;
}
