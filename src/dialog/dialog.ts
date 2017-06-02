import {Injectable, ComponentRef, DynamicComponentLoader, Injector, Component} from 'angular2/core';

const CONTAINER_TAG_NAME = 'ngb-dialog-container';

@Component({selector: CONTAINER_TAG_NAME, template: ''})
class NgbDialogContainer {
}

export class NgbDialogOpenResult {
  constructor(public componentRefs: ComponentRef[]) {}

  disposeAll() {
    this.componentRefs.forEach((component) => { component.dispose(); });
  }
}

@Injectable()
export class NgbDialog {
  private _container: Promise<ComponentRef>;

  constructor(private _dcl: DynamicComponentLoader, private _injector: Injector) {
    var el = document.querySelector(CONTAINER_TAG_NAME);

    if (!el) {
      document.body.appendChild(document.createElement(CONTAINER_TAG_NAME));
    }

    this._container = this._dcl.loadAsRoot(NgbDialogContainer, CONTAINER_TAG_NAME, _injector);
  }

  open(content: any[]): Promise<NgbDialogOpenResult> {
    return this._container.then((container: ComponentRef) => {
      return Promise
          .all(content.map((contentComponent) => {
            return this._dcl.loadNextToLocation(contentComponent, container.location);
          }))
          .then((components: ComponentRef[]) => { return new NgbDialogOpenResult(components); });
    });
  }
}
