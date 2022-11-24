import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbdDemoListService } from '../../services/demo-list.service';
import { NgbdWidgetDemoComponent } from './demo.component';
import { NgComponentOutlet, NgFor } from '@angular/common';

@Component({
	standalone: true,
	imports: [NgbdWidgetDemoComponent, NgComponentOutlet, NgFor],
	template: `
		<ngbd-widget-demo
			*ngFor="let demo of demos"
			[id]="demo.id"
			[demoTitle]="demo.title"
			[code]="demo.code"
			[markup]="demo.markup"
			[component]="component"
			[files]="demo.files"
			[showCode]="demo.showCode"
			[showStackblitz]="demo.showStackblitz ?? true"
		>
			<ng-template [ngComponentOutlet]="demo.type"></ng-template>
		</ngbd-widget-demo>
	`,
})
export class NgbdExamplesPage {
	component: string;
	demos: any = [];

	constructor(route: ActivatedRoute, demoList: NgbdDemoListService) {
		// We go up to parent route defining /components/:widget to read the widget name
		// This route is declared in root app.routing.ts.
		const componentName = (this.component = route.parent!.parent!.snapshot.url[1].path);
		if (componentName) {
			const demos = demoList.getDemos(componentName);
			if (demos) {
				this.demos = Object.keys(demos).map((id) => {
					return { id, ...demos[id] };
				});
			}
		}
	}
}
