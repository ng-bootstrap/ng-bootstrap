import {Component, Input} from '@angular/core';

@Component({
  selector: 'svg[ngbdIcons]',
  templateUrl: './icons.component.html',
  host: {'xmlns': 'http://www.w3.org/2000/svg', '[class.d-none]': 'true', '[style.fill]': '"currentColor"'}
})
export class NgbdIcons {
}


@Component({
  selector: 'svg[ngbdIcon]',
  templateUrl: './icon.component.html',
  host: {
    'xmlns': 'http://www.w3.org/2000/svg',
    'viewBox': '0 0 24 24',
    '[attr.width]': 'width',
    '[attr.height]': 'height',
  }
})
export class NgbdIcon {
  @Input() ngbdIcon: string;
  @Input() width = '24';
  @Input() height = '24';
}
