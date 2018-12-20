import {Component} from '@angular/core';

import {NgbdDemoList} from '../../shared';
import {NgbdOverview} from '../../shared/overview';


@Component({
  selector: 'ngbd-pagination-overview',
  templateUrl: './pagination-overview.component.html',
  host: {'[class.overview]': 'true'}
})
export class NgbdPaginationOverviewComponent {
  NGFOR = `<table>
  <tr *ngFor="let item of items | slice: (page-1) * pageSize : (page-1) * pageSize + pageSize">
    <!-- content here -->
  </tr>
</table>`;

  NGB_PAGINATION = `<ngb-pagination
  [(page)]="page"
  [pageSize]="pageSize"
  [collectionSize]="items.length"></ngb-pagination>`;

  sections: NgbdOverview = {};

  constructor(demoList: NgbdDemoList) {
    this.sections = demoList.getOverviewSections('pagination');
  }
}
