import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({templateUrl: './modal-focustrap.component.html'})
export class ModalFocustrapComponent implements OnInit {
  constructor(private _modal: NgbModal) { this._modal.open('hello modal'); }

  ngOnInit(): void {}
}
