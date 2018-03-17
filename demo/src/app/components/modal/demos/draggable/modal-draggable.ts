import {Component} from '@angular/core';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-draggable',
  templateUrl: './modal-draggable.html'
})
export class NgbdModalDraggable {
  closeResult: string;

  constructor(private modalService: NgbModal) {}

  open(content) {
    this.modalService.open(content, { draggableSelector: '.modal-header' });
  }
}
