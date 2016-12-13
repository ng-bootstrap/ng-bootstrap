import {Component} from '@angular/core';
import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-select',
  templateUrl: './select.component.html'
})
export class NgbdSelect {
  snippets = DEMO_SNIPPETS;
}
