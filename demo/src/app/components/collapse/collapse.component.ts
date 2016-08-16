import {Component} from '@angular/core';
import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-collapse',
  templateUrl: './collapse.component.html'
})
export class NgbdCollapse {
  snippets = DEMO_SNIPPETS;
}
