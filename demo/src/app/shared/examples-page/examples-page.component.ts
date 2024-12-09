import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbdWidgetDemoComponent } from './demo.component';
import { NgComponentOutlet } from '@angular/common';
import { MenuItem } from '../../tokens';
import { NgbdComponentPage } from '../component-wrapper/component-page.class';

@Component({
    selector: 'ngbd-examples-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgbdWidgetDemoComponent, NgComponentOutlet],
    template: `
		@for (demo of component.demos; track demo) {
			<ngbd-widget-demo
				[fragment]="demo.fragment"
				[demoTitle]="demo.title"
				[code]="demo.code"
				[markup]="demo.markup"
				[component]="component.name"
				[files]="demo.files"
				[showStackblitz]="demo.showStackblitz ?? true"
			>
				<ng-template [ngComponentOutlet]="demo.type"></ng-template>
			</ngbd-widget-demo>
		}
	`
})
export class NgbdExamplesPageComponent extends NgbdComponentPage {
	get menuItems(): MenuItem[] {
		return this.component.demos;
	}
}
