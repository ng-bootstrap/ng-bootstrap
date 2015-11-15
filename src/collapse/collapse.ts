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
  private set ngbCollapse(value: boolean) {
    this._open = !value;
    if (this._open === true) {
      this._height = undefined;
    } else {
      this._height = 0;
    }
  }

  private get ngbCollapse(): boolean { return this._open; }
}