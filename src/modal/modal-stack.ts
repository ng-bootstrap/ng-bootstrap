import {Injectable, Injector, ComponentFactoryResolver} from '@angular/core';

import {NgbModalRef} from './modal-ref';
import {NgbModalContainer} from './modal-container';

@Injectable()
export class NgbModalStack {
  private modalContainer: NgbModalContainer;

  open(moduleCFR: ComponentFactoryResolver, contentInjector: Injector, content: any, options = {}): NgbModalRef {
    if (!this.modalContainer) {
      throw new Error(
          'Missing modal container, add <template ngbModalContainer></template> to one of your application templates.');
    }

    return this.modalContainer.open(moduleCFR, contentInjector, content, options);
  }

  registerContainer(modalContainer: NgbModalContainer) { this.modalContainer = modalContainer; }
}
