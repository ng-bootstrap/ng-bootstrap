import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';

import { Snippet } from '../../../services/snippet';
import { CodeComponent } from '../../../shared/code.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdApiDocsBadge } from '../../../shared/api-docs';
import { RouterLink } from '@angular/router';
import { NgbdAccordionDemoComponent } from './demo/accordion-overview-demo.component';
import { PageHeaderComponent } from '../../../shared/page-header.component';
import { LIB_VERSIONS } from '../../../tokens';

@Component({
	selector: 'ngbd-accordion-overview',
	standalone: true,
	imports: [
		CodeComponent,
		NgbAlertModule,
		NgbdApiDocsBadge,
		RouterLink,
		NgbdAccordionDemoComponent,
		PageHeaderComponent,
	],
	templateUrl: './accordion-overview.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { '[class.overview]': 'true' },
})
export class NgbdAccordionOverviewComponent {
	bootstrapVersion = inject(LIB_VERSIONS).bootstrap;
	@Input() overview: { fragment: string; title: string };

	BASIC_ACCORDION = Snippet({
		lang: 'html',
		code: `
      <div ngbAccordion>
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
      </div>
    `,
	});

	API_TPL = Snippet({
		lang: 'html',
		code: `
      <div ngbAccordion #accordion="NgbAccordion">
        <div ngbAccordionItem="first" #first="ngbAccordionItem" [collapsed]="false"> ... </div>
      </div>
    `,
	});

	API_CODE = Snippet({
		lang: 'typescript',
		code: `
      accordion.toggle('first'); // toggle the first item
      accordion.closeAll(); 		 // close all items

      first.toggle();  				// toggle the first item
      first.collapsed; 				// true if collapsed
      first.collapsed = true; // collapse the first item
      first.disabled; 			 	// true if disabled
      first.disabled = true; 	// disable the first item
      first.id;        				// 'first'
    `,
	});

	HIDE_OTHERS = Snippet({
		lang: 'html',
		code: `<div ngbAccordion [closeOthers]="true"> ... </div>`,
	});

	KEEP_DOM = Snippet({
		lang: 'html',
		code: `
      <div ngbAccordion [destroyOnHide]="true">
        <div ngbAccordionItem [destroyOnHide]="false"> ... </div>
      </div>`,
	});

	EVENTS = Snippet({
		lang: 'html',
		code: `
      <div ngbAccordion (shown)="onShow($event)" (hidden)="onHide($event)">
        <div ngbAccordionItem (shown)="onItemShow()" (hidden)="onItemHide()"> ... </div>
      </div>`,
	});

	CUSTOM_HEADER = Snippet({
		lang: 'html',
		code: `
      <style>
        .my-custom-header::after {
          content: none;
        }
      </style>

      <div ngbAccordionHeader class="accordion-button my-custom-header">
        <p>Custom header</p>
        <div>
          <button ngbAccordionToggle class="my-toggle-button">Toggle this panel</button>
          <button class="my-close-all-button">Close all</button>
        </div>
      </div>
    `,
	});
}
