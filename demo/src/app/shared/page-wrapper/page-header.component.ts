import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { NgbdFragment } from '../fragment/fragment.directive';
import { NgbdOverviewSection } from '../overview/overview';

@Component({
	selector: 'ngbd-page-header',
	standalone: true,
	imports: [RouterLinkWithHref, NgbdFragment],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'd-block',
	},
	template: `
		<h2>
			<a routerLink="." [fragment]="fragment" ngbdFragment>
				<i class="bi bi-link-45deg" style="font-size: 1.75rem; color: black"></i>
			</a>
			{{ title }}
		</h2>
	`,
})
export class NgbdPageHeaderComponent implements NgbdOverviewSection {
	@Input() title: string;
	@Input() fragment: string;
}
