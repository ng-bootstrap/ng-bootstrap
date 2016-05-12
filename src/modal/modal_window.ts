import {
  Component,
  Output,
  EventEmitter,
  Input,
  HostListener,
} from "@angular/core";

import {ModalDismissReasons} from './modal_dismiss_reasons';

@Component({
  selector: 'ngb-modal-window',
  host: {"class": "modal", "role": "dialog", "tabindex": "-1", "style": "display: block;"},
  template: `
        <div [class]="'modal-dialog' + (size ? ' modal-' + size : '')">
            <div class="modal-content" (click)="stopPropagation($event)">
                <ng-content></ng-content>                          
            </div>
        </div>
    `
})
export class NgbModalWindow {
  @Input() backdrop = true;
  @Input() keyboard = true;
  @Input() size: string;

  @Output('close') closeEvent = new EventEmitter();
  @Output('dismiss') dismissEvent = new EventEmitter();

  @HostListener('click')
  backdropClick(): void {
    if (this.backdrop) {
      this.dismiss(ModalDismissReasons.BACKDROP_CLICK);
    }
  }

  @HostListener('keyup.esc')
  escKey(): void {
    if (this.keyboard) {
      this.dismiss(ModalDismissReasons.ESC);
    }
  }

  close(result): void { this.closeEvent.emit(result); }

  dismiss(reason): void { this.dismissEvent.emit(reason); }

  stopPropagation($event: MouseEvent): void { $event.stopPropagation(); }
}
