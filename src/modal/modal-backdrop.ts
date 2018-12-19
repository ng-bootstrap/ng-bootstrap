import {Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'ngb-modal-backdrop',
  encapsulation: ViewEncapsulation.None,
  template: '',
  host: {'[class]': '"modal-backdrop fade show" + (backdropClass ? " " + backdropClass : "")'}
})
export class NgbModalBackdrop {
  @Input() backdropClass: string;
}
