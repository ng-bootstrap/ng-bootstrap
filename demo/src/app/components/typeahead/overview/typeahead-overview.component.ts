import { Component } from '@angular/core';

import { NgbdDemoList } from '../../shared';
import { NgbdOverview } from '../../shared/overview';

@Component({
  selector: 'ngbd-typeahead-overview',
  templateUrl: './typeahead-overview.component.html',
  host: {
    '[class.overview]': 'true'
  }
})
export class NgbdTypeaheadOverviewComponent {
  sections: NgbdOverview = {};

  constructor(demoList: NgbdDemoList) {
    this.sections = demoList.getOverviewSections('typeahead');
  }
}
