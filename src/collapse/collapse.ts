import {Directive, Input} from 'angular2/angular2';

@Directive({
  selector: '[ngb-collapse]',
  host: {'class': 'collapse', '[class.in]': '_open', '[attr.aria-expanded]': '_open', '[style.height.px]': '_height'}
})
export class NgbCollapse {
  private _open: boolean;
  private _height: number;

  constructor() { this._open = this.ngbCollapse; }

  @Input()
  set ngbCollapse(value: boolean) {
    this._open = !value;
    this._setHeight()
  }

  get ngbCollapse(): boolean { return this._open; }

  private _setHeight() {
    if (this._open === true) {
      this._height = undefined;
    } else {
      this._height = 0;
    }
  }
}