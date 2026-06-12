import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * A configuration service for the [`NgbPagination`](#/components/pagination/api#NgbPagination) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the paginations used in the application.
 */
@Injectable({ providedIn: 'root' })
export class NgbPaginationConfig {
	disabled = false; /**
	 * Stream to emit from when config is changed.
	 * Use this to notify components to trigger change detection
	 */
	readonly changes: Subject<void> = new Subject<void>();

	firstLabel = $localize`:@@ngb.pagination.first:««`;
	previousLabel = $localize`:@@ngb.pagination.previous:«`;
	nextLabel = $localize`:@@ngb.pagination.next:»`;
	lastLabel = $localize`:@@ngb.pagination.last:»»`;

	firstAriaLabel = $localize`:@@ngb.pagination.first-aria:First`;
	previousAriaLabel = $localize`:@@ngb.pagination.previous-aria:Previous`;
	nextAriaLabel = $localize`:@@ngb.pagination.next-aria:Next`;
	lastAriaLabel = $localize`:@@ngb.pagination.last-aria:Last`;

	boundaryLinks = false;
	directionLinks = true;
	ellipses = true;
	maxSize = 0;
	pageSize = 10;
	rotate = false;
	size: 'sm' | 'lg' | string | null;
}
