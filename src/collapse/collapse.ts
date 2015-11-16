import {Directive, Input} from 'angular2/angular2';

@Directive({
  selector: '[ngb-collapse]',
  host: {
    'class': 'collapse',
    '[class.in]': '!_collapsed',
    '[attr.aria-expanded]': '!_collapsed',
    '[style.height.px]': '_height'
  }
})
export class NgbCollapse {
  private _collapsed: boolean;
  private _height: number;

  constructor() {}

  @Input('ngbCollapse')
  set collapsed(value: boolean) {
    this._collapsed = value;
    this._setHeight()
  }

  get collapsed(): boolean { return this._collapsed; }

  private _setHeight(): void { this._height = this._collapsed ? 0 : undefined; }
}
