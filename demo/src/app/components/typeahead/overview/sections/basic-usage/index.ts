import {
  Component,
} from '@angular/core';

import {SNIPPETS} from './snippets';



@Component({
  selector: 'ngbd-typeahead-overview-section-basic-usage',
  templateUrl: './template.html',
})
export class NgbdTypeaheadOverviewSectionBasicUsageComponent {
  snippets = SNIPPETS;
}
