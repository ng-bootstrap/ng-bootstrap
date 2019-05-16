import { Component } from '@angular/core';

import { SNIPPETS } from './snippets';



@Component({
  selector: 'ngbd-typeahead-overview-section-customize-option-in-input',
  templateUrl: './template.html',
})
export class NgbdTypeaheadOverviewSectionCustomizeOptionInInputComponent {
  snippets = SNIPPETS;
}
