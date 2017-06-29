import { Directive, Input } from '@angular/core';

@Directive({
  selector: 'a[fragment]',
  host: {
    '[class.fragment]': 'true',
    '[attr.id]': 'fragment'
  }
})
export class NgbdFragment {
  @Input() fragment: string;
}
