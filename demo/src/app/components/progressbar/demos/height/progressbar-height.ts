import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-progressbar-height',
  templateUrl: './progressbar-height.html',
  styles: [`
    ngb-progressbar {
      margin-top: 5rem;
    }
  `]
})
export class NgbdProgressbarHeight {
  height = '20px';
}
