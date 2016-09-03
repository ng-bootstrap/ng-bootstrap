import {Component} from '@angular/core';
import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-rating',
  templateUrl: './rating.component.html'
})
export class NgbdRating {
  snippets = DEMO_SNIPPETS;
}
