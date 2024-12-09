import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'ngbd-page-header',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink],
    host: {
        class: 'd-block',
    },
    template: `
		<h2 [id]="fragment()">
			<a class="title-fragment" routerLink="." [fragment]="fragment()">
				<i class="bi bi-link-45deg" style="font-size: 1.75rem; color: var(--bs-heading-color)"></i>
			</a>
			{{ title() }}
		</h2>
		<ng-content></ng-content>
	`
})
export class PageHeaderComponent {
	fragment = input.required<string>();
	title = input.required<string>();
}
