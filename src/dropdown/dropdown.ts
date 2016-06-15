import {Directive, Input, HostListener} from '@angular/core';

@Directive(
    {selector: '[ngbDropdown]', exportAs: 'ngbDropdown', host: {'[class.open]': 'open', '(keyup.esc)': 'close()'}})
export class NgbDropdown {
  @Input() open: boolean = false;

  close() { this.open = false; }
}

@Directive({
  selector: '[ngbDropdownToggle]',
  host: {'class': 'dropdown-toggle', 'aria-haspopup': 'true', '[attr.aria-expanded]': '_dropdown.open'}
})
export class NgbDropdownToggle {
  constructor(private _dropdown: NgbDropdown) {}

  @HostListener('click')
  toggleOpen() {
    this._dropdown.open = !this._dropdown.open;
  }
}
