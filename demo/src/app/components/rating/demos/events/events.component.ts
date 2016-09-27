import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-rating-events',
  templateUrl: 'events.component.html'
})
export class RatingEventsComponent {
  selected = 0;
  hovered = 0;
  readonly = false;
}
