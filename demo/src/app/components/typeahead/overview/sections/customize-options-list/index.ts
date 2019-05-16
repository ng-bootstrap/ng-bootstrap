import { Component } from '@angular/core';

import { SNIPPETS } from './snippets';



@Component({
  selector: 'ngbd-typeahead-overview-section-customize-options-list',
  templateUrl: './template.html',
})
export class NgbdTypeaheadOverviewSectionCustomizeOptionsListComponent {
  snippets = SNIPPETS;
}
