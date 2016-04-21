import {
  Component,
  Output,
  EventEmitter,
  DynamicComponentLoader,
  Input,
  HostListener,
  ComponentRef,
  TemplateRef,
  ViewChild
} from "angular2/core";
import {ModalDismissReasons} from './modal_dismiss_reasons';

@Component({
  selector: 'ngb-modal-window',
  host: {"class": "modal", "role": "dialog", "tabindex": "-1", "style": "display: block;"},
  template: `
        <div [class]="'modal-dialog' + (size ? ' modal-' + size : '')">
            <div class="modal-content" (click)="stopPropagation($event)">
                <template><!-- content insertion point--></template>                          
            </div>
        </div>
    `
})
export class NgbModalWindow {
  @ViewChild(TemplateRef) private _contentTplRef: TemplateRef;

  @Input() backdrop = true;
  @Input() keyboard = true;
  @Input() size: string;

  @Output('close') closeEvent = new EventEmitter();
  @Output('dismiss') dismissEvent = new EventEmitter();

  constructor(private _dcl: DynamicComponentLoader) {}

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

  close(result: any): void { this.closeEvent.emit(result); }

  dismiss(reason): void { this.dismissEvent.emit(reason); }

  stopPropagation($event: MouseEvent): void { $event.stopPropagation(); }

  loadContent(content: any): Promise<ComponentRef> {
    return this._dcl.loadNextToLocation(content, this._contentTplRef.elementRef);
  }
}
