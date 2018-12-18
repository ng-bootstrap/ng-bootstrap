import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Hi there!</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')" [disabled]="disabled">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>Hello, {{name}}!</p>
      <hr/>
      <p>Disable modal closing: <input type="checkbox" [(ngModel)]="disabled"></p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')" [disabled]="disabled">Close</button>
    </div>
  `
})
export class NgbdModalContent {
  @Input() name;

  private _disabled: boolean;

  constructor(public activeModal: NgbActiveModal) {
    this._disabled = false;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
    this.activeModal.windowComponentInstance.backdrop = this._disabled ? 'static' : true;
    this.activeModal.windowComponentInstance.keyboard = !this._disabled;
  }
}

@Component({
  selector: 'ngbd-modal-component',
  templateUrl: './modal-component.html'
})
export class NgbdModalComponent {
  constructor(private modalService: NgbModal) {}

  open() {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = 'World';
  }
}
