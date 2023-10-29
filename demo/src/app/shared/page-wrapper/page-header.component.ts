import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbdOverviewSection } from '../overview/overview';

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
	`,
})
export class NgbdPageHeaderComponent implements NgbdOverviewSection {
	@Input() title: string;
	@Input() fragment: string;
}
