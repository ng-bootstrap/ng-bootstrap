import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import apiDocs from '../../../api-docs';
import { NgbdApiDocs, NgbdApiDocsClass, NgbdApiDocsConfig } from '../api-docs';

export function getApis(component: string) {
	const components: any[] = [];
	const classes: any[] = [];
	const configs: any[] = [];
	Object.values(apiDocs)
		.filter((entity) => entity.fileName.startsWith(`src/${component}`))
		.forEach((entity) => {
			switch (entity.type) {
				case 'Directive':
				case 'Component':
					components.push(entity.className);
					break;

				case 'Service':
					if (entity.className.endsWith('Config')) {
						configs.push(entity.className);
					} else {
						classes.push(entity.className);
					}
					break;
				default:
					classes.push(entity.className);
					break;
			}
		});
	return { components, classes, configs };
}

@Component({
	standalone: true,
	imports: [NgbdApiDocs, NgbdApiDocsClass, NgbdApiDocsConfig],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@for (component of components; track component) {
			<ngbd-api-docs [directive]="component"></ngbd-api-docs>
		}
		@for (klass of classes; track klass) {
			<ngbd-api-docs-class [type]="klass"></ngbd-api-docs-class>
		}
		@for (config of configs; track config) {
			<ngbd-api-docs-config [type]="config"></ngbd-api-docs-config>
		}
	`,
})
export class NgbdApiPage {
	classes: string[];
	components: string[];
	configs: string[];

	constructor(route: ActivatedRoute) {
		const component = route.parent!.parent!.snapshot.url[1].path;
		const apis = getApis(component);
		this.components = apis.components.sort();
		this.classes = apis.classes.sort();
		this.configs = apis.configs.sort();
	}
}
