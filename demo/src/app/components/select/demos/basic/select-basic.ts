import { Component } from '@angular/core';

@Component({
  selector: 'ngbd-select-basic',
  templateUrl: './select-basic.html'
})
export class NgbdSelectBasic {
  public options = ['AL', 'BL', 'CL'];
  public value = 'AL';

}
