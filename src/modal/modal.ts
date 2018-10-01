import {Injectable, Injector, ComponentFactoryResolver} from '@angular/core';

import {NgbModalOptions, NgbModalConfig} from './modal-config';
import {NgbModalRef} from './modal-ref';
import {NgbModalStack} from './modal-stack';

/**
 * A service to open modal windows. Creating a modal is straightforward: create a template and pass it as an argument to
 * the "open" method!
 */
@Injectable({providedIn: 'root'})
export class NgbModal {
  constructor(
      private _moduleCFR: ComponentFactoryResolver, private _injector: Injector, private _modalStack: NgbModalStack,
      private _config: NgbModalConfig) {}

  /**
   * Opens a new modal window with the specified content and using supplied options. Content can be provided
   * as a TemplateRef or a component type. If you pass a component type as content than instances of those
   * components can be injected with an instance of the NgbActiveModal class. You can use methods on the
   * NgbActiveModal class to close / dismiss modals from "inside" of a component.
   */
  open(content: any, options: NgbModalOptions = {}): NgbModalRef {
    const combinedOptions = Object.assign({}, this._config, options);
    return this._modalStack.open(this._moduleCFR, this._injector, content, combinedOptions);
  }

  /**
   * Dismiss all currently displayed modal windows with the supplied reason.
   *
   * @since 3.1.0
   */
  dismissAll(reason?: any) { this._modalStack.dismissAll(reason); }
}
