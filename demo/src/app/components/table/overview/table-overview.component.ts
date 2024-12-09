import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { NgbdTableOverviewDemo } from './demo/table-overview-demo.component';
import { PageHeaderComponent } from '../../../shared/page-header.component';
import { NgbdOverviewPage } from '../../../shared/overview-page/overview-page.class';

@Component({
    selector: 'ngbd-table-overview',
    imports: [NgbAlertModule, RouterLink, NgbdTableOverviewDemo, PageHeaderComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './table-overview.component.html',
    host: {
        '[class.overview]': 'true',
    }
})
export class NgbdTableOverviewComponent extends NgbdOverviewPage {}
