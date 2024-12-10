import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import docs from '../../../api-docs';
import { ClassDesc, MethodDesc, signature } from './api-docs.model';
import { AnalyticsService } from '../../services/analytics.service';
import { RouterLink } from '@angular/router';
import { NgbdApiDocsBadge } from './api-docs-badge.component';
import { COMPONENT_DATA } from '../../tokens';

/**
 * Displays the API docs of a class, which is not a directive.
 *
 * For Config services, use NgbdApiDocsConfig instead.
 */
@Component({
	selector: 'ngbd-api-docs-class',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, NgbdApiDocsBadge],
	templateUrl: './api-docs-class.component.html',
})
export class NgbdApiDocsClass {
	private analytics = inject(AnalyticsService);
	private componentName = inject(COMPONENT_DATA).name;

	type = input.required<string>();
	apiDocs = computed<ClassDesc>(() => docs[this.type()]);

	methodSignature(method: MethodDesc): string {
		return signature(method);
	}

	trackSourceClick() {
		this.analytics.trackClick('ngb_view_source_code', {
			component_name: this.componentName.toLowerCase(),
			class_name: this.apiDocs().className,
		});
	}
}
