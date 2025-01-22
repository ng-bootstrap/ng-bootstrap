import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const BADGES = {
	Directive: 'success',
	Component: 'success',
	Service: 'primary',
	Configuration: 'primary',
	Class: 'danger',
	Interface: 'danger',
};

@Component({
	selector: 'ngbd-api-docs-badge',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<h5>
			@if (deprecated()) {
				<span class="badge bg-secondary me-1">Deprecated {{ deprecated()?.version }}</span>
			}
			@if (since()) {
				<span class="badge bg-info text-dark me-1">Since {{ since()?.version }}</span>
			}
			<span class="badge {{ badgeClass() }}">{{ type() }}</span>
		</h5>
	`,
})
export class NgbdApiDocsBadge {
	type = input('');
	deprecated = input<{ version: string }>();
	since = input<{ version: string }>();

	badgeClass = computed(() => `bg-${BADGES[this.type()] || 'secondary'}`);
}
