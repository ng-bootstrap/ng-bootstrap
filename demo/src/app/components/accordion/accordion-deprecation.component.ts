import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-acccordion-deprecation',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgbAlert],
	template: `
		<ngb-alert type="warning" [dismissible]="false">
			<p>
				This page describes accordion directives that were introduced in <code>14.1.0</code>. Previous implementation of
				the accordion was component-based and was removed in <code>16.0.0</code>.
			</p>
			You can find documentation and examples for the old version
			<a href="/releases/13.x/#/components/accordion">here</a>.
		</ngb-alert>
	`,
})
export class NgbdAcccordionDeprecationComponent {}
