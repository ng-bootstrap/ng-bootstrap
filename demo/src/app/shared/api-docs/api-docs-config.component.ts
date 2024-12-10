import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import docs from '../../../api-docs';
import { ClassDesc } from './api-docs.model';
import { AnalyticsService } from '../../services/analytics.service';
import { RouterLink } from '@angular/router';
import { NgbdApiDocsBadge } from './api-docs-badge.component';
import { COMPONENT_DATA } from '../../tokens';

const CONFIG_SUFFIX_LENGTH = 'Config'.length;

/**
 * Displays the API docs of a Config service. A Config service for a component Foo is named, by convention,
 * FooConfig, and only has properties, whose name matches with an input of the directive.
 * In order to avoid cluttering the demo pages, the only things displayed by this component
 * is the description of the Config service and the list of its properties, whose documentation and
 * default value is documented in the directive itself.
 */
@Component({
	selector: 'ngbd-api-docs-config',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, NgbdApiDocsBadge],
	templateUrl: './api-docs-config.component.html',
})
export class NgbdApiDocsConfig {
	private analytics = inject(AnalyticsService);
	private componentName = inject(COMPONENT_DATA).name;

	type = input<string>('');

	apiDocs = computed<ClassDesc>(() => docs[this.type()]);
	directiveName = computed<string>(() => this.type().slice(0, -CONFIG_SUFFIX_LENGTH));

	trackSourceClick() {
		this.analytics.trackClick('ngb_view_source_code', {
			component_name: this.componentName.toLowerCase(),
			class_name: this.apiDocs().className,
		});
	}
}
