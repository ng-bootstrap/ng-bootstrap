import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'ngbd-popover-custom-class',
  templateUrl: './popover-custom-class.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .my-custom-class {
      background: aliceblue;
      font-size: 125%;
    }
    .my-custom-class .arrow::after {
      border-top-color: aliceblue;
    }
  `]
})
export class NgbdPopoverCustomClass {
}
