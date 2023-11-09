import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'ngbd-page-header',
	standalone: true,
	imports: [RouterLink],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'd-block',
	},
	template: `
		<h2 [id]="fragment">
			<a class="title-fragment" routerLink="." [fragment]="fragment">
				<i class="bi bi-link-45deg" style="font-size: 1.75rem; color: var(--bs-heading-color)"></i>
			</a>
			{{ title }}
		</h2>
		<ng-content></ng-content>
	`,
})
export class PageHeaderComponent {
	@Input() fragment: string;
	@Input() title: string;
}
