import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbdWidgetDemoComponent } from './demo.component';
import { NgComponentOutlet } from '@angular/common';

@Component({
	standalone: true,
	imports: [NgbdWidgetDemoComponent, NgComponentOutlet],
	template: `
		@for (demo of demos; track demo) {
			<ngbd-widget-demo
				[fragment]="demo.fragment"
				[demoTitle]="demo.title"
				[code]="demo.code"
				[markup]="demo.markup"
				[component]="componentName"
				[files]="demo.files"
				[showCode]="demo.showCode"
				[showStackblitz]="demo.showStackblitz ?? true"
			>
				<ng-template [ngComponentOutlet]="demo.type"></ng-template>
			</ngbd-widget-demo>
		}
	`,
})
export class DemoListComponent {
	componentName = inject(ActivatedRoute).parent!.snapshot.data.name;
	@Input() demos: any;
}
