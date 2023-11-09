import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { LIB_VERSIONS } from '../../../tokens';
import { RouterLink } from '@angular/router';
import { NgbdTableOverviewDemo } from './demo/table-overview-demo.component';
import { PageHeaderComponent } from '../../../shared/page-header.component';

@Component({
	selector: 'ngbd-table-overview',
	standalone: true,
	imports: [NgbAlertModule, RouterLink, NgbdTableOverviewDemo, PageHeaderComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './table-overview.component.html',
	host: {
		'[class.overview]': 'true',
	},
})
export class NgbdTableOverviewComponent {
	@Input() overview: { fragment: string; title: string };
	bootstrapVersion = inject(LIB_VERSIONS).bootstrap;
}
