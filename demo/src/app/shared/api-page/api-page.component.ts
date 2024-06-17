import { ChangeDetectionStrategy, Component } from '@angular/core';

import apiDocs from '../../../api-docs';
import { NgbdApiDocs, NgbdApiDocsClass, NgbdApiDocsConfig } from '../api-docs';
import { NgbdComponentPage } from '../component-wrapper/component-page.class';
import { MENU_SEPARATOR, MenuItem } from 'src/app/tokens';

export function getApis(component: string) {
	const components: string[] = [];
	const classes: string[] = [];
	const configs: string[] = [];
	Object.values(apiDocs)
		.filter((entity) => entity.fileName.startsWith(`src/${component.toLowerCase()}`))
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

function toMenuItems(names: string[]): MenuItem[] {
	return names.map((name) => ({ fragment: name, title: name }));
}

@Component({
	selector: 'ngbd-api-page',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgbdApiDocs, NgbdApiDocsClass, NgbdApiDocsConfig],
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
export class NgbdApiPage extends NgbdComponentPage {
	get menuItems(): MenuItem[] {
		const components = toMenuItems(this.components);
		const classes = toMenuItems(this.classes);
		const configs = toMenuItems(this.configs);

		let menuItems: MenuItem[] = [...components];
		if (classes) {
			menuItems.push(MENU_SEPARATOR());
		}
		menuItems.push(...classes);
		if (configs) {
			menuItems.push(MENU_SEPARATOR());
		}
		menuItems.push(...configs);

		return menuItems;
	}

	classes: string[];
	components: string[];
	configs: string[];

	constructor() {
		super();
		const apis = getApis(this.component.name);
		this.components = apis.components.sort();
		this.classes = apis.classes.sort();
		this.configs = apis.configs.sort();
	}
}
