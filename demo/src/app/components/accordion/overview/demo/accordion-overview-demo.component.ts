import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbAccordionDirective, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-accordion-demo',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgbAccordionModule, NgbAccordionDirective],
    template: `
		<div ngbAccordion [closeOthers]="true">
			<div ngbAccordionItem>
				<h2 ngbAccordionHeader>
					<button ngbAccordionButton>First</button>
				</h2>
				<div ngbAccordionCollapse>
					<div ngbAccordionBody>
						<ng-template>Content for the first item</ng-template>
					</div>
				</div>
			</div>

			<div ngbAccordionItem>
				<h2 ngbAccordionHeader>
					<button ngbAccordionButton>Second</button>
				</h2>
				<div ngbAccordionCollapse>
					<div ngbAccordionBody>
						<ng-template>Content for the second item</ng-template>
					</div>
				</div>
			</div>
		</div>
	`
})
export class NgbdAccordionDemoComponent {}
