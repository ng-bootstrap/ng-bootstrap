import {Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'ngb-modal-backdrop',
  encapsulation: ViewEncapsulation.None,
  template: '',
  host:
      {'[class]': '"modal-backdrop fade show" + (backdropClass ? " " + backdropClass : "")', 'style': 'z-index: 1050'}
})
export class NgbModalBackdrop {
  @Input() backdropClass: string;
}
