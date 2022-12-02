import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

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
	standalone: true,
	imports: [NgIf],
	template: `
		<h5>
			<span *ngIf="deprecated" class="badge bg-secondary">Deprecated {{ deprecated.version }}</span
			>&ngsp; <span *ngIf="since" class="badge bg-info text-dark">Since {{ since.version }}</span
			>&ngsp;
			<span class="badge {{ badgeClass }}">{{ text }}</span>
		</h5>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgbdApiDocsBadge {
	badgeClass: string;
	text: string;

	@Input() deprecated?: { version: string };

	@Input() since?: { version: string };

	@Input()
	set type(type: string) {
		this.text = type;
		this.badgeClass = `bg-${BADGES[type] || 'secondary'}`;
	}
}
