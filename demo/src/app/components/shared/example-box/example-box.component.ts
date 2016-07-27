import { Component, Input } from '@angular/core';
import {Analytics} from '../../../shared/analytics/analytics';

@Component({
  selector: 'ngbd-example-box',
  templateUrl: './example-box.component.html'
})
export class ExampleBoxComponent {
  @Input() demoTitle: string;
  @Input() component: string;
  @Input() demo: string;
  @Input() snippets: Object;
  showCode = false;

  constructor(private _analytics: Analytics) {}

  toggleCode() {
    this.showCode = !this.showCode;
    if (this.showCode) {
      this._analytics.trackEvent('Demo code view', this.demoTitle);
    }
  }
}
