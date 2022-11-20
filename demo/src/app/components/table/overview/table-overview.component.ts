import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '../../../../environments/environment';

import { NgbdDemoListService } from '../../../services/demo-list.service';
import { RouterLink } from '@angular/router';
import { NgbdTableOverviewDemo } from './demo/table-overview-demo.component';
import { NgbdOverviewSectionComponent } from '../../../shared/overview/overview-section.component';
import { NgbdOverview } from '../../../shared/overview/overview';

@Component({
	selector: 'ngbd-table-overview',
	standalone: true,
	imports: [NgbAlertModule, NgbdOverviewSectionComponent, RouterLink, NgbdTableOverviewDemo],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './table-overview.component.html',
	host: {
		'[class.overview]': 'true',
	},
})
export class NgbdTableOverviewComponent {
	bootstrapVersion = environment.bootstrap;

	sections: NgbdOverview = {};

	constructor(demoList: NgbdDemoListService) {
		this.sections = demoList.getOverviewSections('table');
	}
}
