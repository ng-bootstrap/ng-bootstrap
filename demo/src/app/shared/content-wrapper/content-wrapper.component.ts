import {Component, Input, OnChanges} from '@angular/core';

@Component({
  selector: 'ngbd-content-wrapper',
  templateUrl: './content-wrapper.component.html'
})
export class ContentWrapper implements OnChanges {
  @Input()
  public component: string;

  ngOnChanges(changes) {
    if (changes.component) {
      document.body.scrollIntoView();
    }
  }
}
