import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import docs from '../../../api-docs';
import { ClassDesc, MethodDesc, signature } from './api-docs.model';
import { AnalyticsService } from '../../services/analytics.service';
import { RouterLink } from '@angular/router';
import { NgbdApiDocsBadge } from './api-docs-badge.component';

/**
 * Displays the API docs of a class, which is not a directive.
 *
 * For Config services, use NgbdApiDocsConfig instead.
 */
@Component({
	selector: 'ngbd-api-docs-class',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, NgbdApiDocsBadge],
	templateUrl: './api-docs-class.component.html',
})
export class NgbdApiDocsClass {
	private _analytics = inject(AnalyticsService);

	type = input.required<string>();
	apiDocs = computed<ClassDesc>(() => docs[this.type()]);

	methodSignature(method: MethodDesc): string {
		return signature(method);
	}

	trackSourceClick() {
		this._analytics.trackEvent('Source File View', this.apiDocs().className);
	}
}
