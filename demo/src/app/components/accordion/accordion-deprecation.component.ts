import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-acccordion-deprecation',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgbAlert],
	template: `
		<ngb-alert type="warning" [dismissible]="false">
			This page describes accordion directives that were introduced in <code>14.1.0</code>. Previous implementation of
			the accordion was component-based and is deprecated since <code>14.1.0</code>. You can find related documentation
			and examples for the old version <a href="/releases/13.x/#/components/accordion">here</a>.
		</ngb-alert>
	`,
})
export class NgbdAcccordionDeprecationComponent {}
