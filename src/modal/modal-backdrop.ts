import {Component, Input} from '@angular/core';

@Component({
  selector: 'ngb-modal-backdrop',
  template: '',
  host: {'[class]': '"modal-backdrop fade show" + (backdropClass ? " " + backdropClass : "")'}
})
export class NgbModalBackdrop {
  @Input() backdropClass: string;
}
