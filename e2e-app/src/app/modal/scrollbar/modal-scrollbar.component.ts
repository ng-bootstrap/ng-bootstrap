import {Component, TemplateRef} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({templateUrl: './modal-scrollbar.component.html'})
export class ModalScrollbarComponent {
  constructor(private modalService: NgbModal) {}

  openModal(content: TemplateRef<any>) { this.modalService.open(content, {scrollable: true}); }
}
