import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import docs from '../../../api-docs';
import { DirectiveDesc, InputDesc, MethodDesc, PropertyDesc, signature } from './api-docs.model';
import { AnalyticsService } from '../../services/analytics.service';
import { RouterLink } from '@angular/router';
import { NgbdApiDocsBadge } from './api-docs-badge.component';
import { COMPONENT_DATA } from '../../tokens';

/**
 * Displays the API docs of a directive.
 *
 * The default values of its inputs are looked for in the directive api doc itself, or in the matching property
 * of associated Config service, if any.
 *
 * The config service of a directive NgbFoo is, by convention, named NgbFooConfig.
 */
@Component({
	selector: 'ngbd-api-docs',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, NgbdApiDocsBadge],
	templateUrl: './api-docs.component.html',
})
export class NgbdApiDocs {
	private analytics = inject(AnalyticsService);
	private componentName = inject(COMPONENT_DATA).name;

	directive = input.required<string>();
	apiDocs = computed<DirectiveDesc>(() => docs[this.directive()]);
	configServiceName = computed(() =>
		this.directive() === 'NgbAccordionDirective' ? 'NgbAccordionConfig' : `${this.directive()}Config`,
	);

	private _configProperties = computed<{ [propertyName: string]: PropertyDesc }>(() => {
		const configApiDocs = docs[this.configServiceName()];

		// Fix for the datepicker config name
		if (this.directive() === 'NgbInputDatepicker') {
			configApiDocs.properties = [...configApiDocs.properties, ...docs['NgbDatepickerConfig'].properties];
		}

		let properties = {};
		if (configApiDocs) {
			this.apiDocs().inputs.forEach(
				(input) => (properties[input.name] = configApiDocs.properties.filter((prop) => prop.name === input.name)[0]),
			);
		}

		return properties;
	});

	/**
	 * Returns the default value of the given directive input by first looking for it in the matching config service
	 * property. If there is no matching config property, it reads it from the input.
	 */
	defaultInputValue(input: InputDesc): string {
		const configProperty = this._configProperties()[input.name];
		return (configProperty ? configProperty.defaultValue : input.defaultValue) || '';
	}

	/**
	 * Returns true if there is a config service property matching with the given directive input
	 */
	hasConfigProperty(input: InputDesc): boolean {
		return !!this._configProperties()[input.name];
	}

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
