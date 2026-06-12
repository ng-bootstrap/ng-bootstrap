import { Component } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';
import { RouterLink } from '@angular/router';
import { NgbdTableOverviewDemo } from './demo/table-overview-demo.component';
import { PageHeaderComponent } from '../../../shared/page-header.component';
import { NgbdOverviewPage } from '../../../shared/overview-page/overview-page.class';

@Component({
	selector: 'ngbd-table-overview',
	imports: [NgbAlert, RouterLink, NgbdTableOverviewDemo, PageHeaderComponent],
	templateUrl: './table-overview.component.html',
	host: {
		'[class.overview]': 'true',
	},
})
export class NgbdTableOverviewComponent extends NgbdOverviewPage {}
