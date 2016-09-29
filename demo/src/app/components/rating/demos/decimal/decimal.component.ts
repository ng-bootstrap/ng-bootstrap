import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-rating-decimal',
  templateUrl: './decimal.component.html',
  styles: [`
    .star {
      position: relative;  
      display: inline-block;
      font-size: 3rem;
      color: #d3d3d3;
    }
    .full {
      color: red;
    }
    .half {
      position: absolute;
      display: inline-block;
      overflow: hidden;
      color: red;
    }
  `]
})
export class RatingDecimalComponent {
  currentRate = 3.14;
}
