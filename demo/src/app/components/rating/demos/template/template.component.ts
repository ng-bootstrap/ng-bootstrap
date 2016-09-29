import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-rating-template',
  templateUrl: './template.component.html',
  styles: [`
    .star {
      font-size: 1.5rem;
      color: #b0c4de;
    }
    .filled {
      color: #1e90ff;
    }
  `]
})
export class RatingTemplateComponent {
  currentRate = 6;
}
