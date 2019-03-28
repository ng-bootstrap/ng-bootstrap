import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {Analytics} from '../../../shared/analytics/analytics';

@Component({
  selector: 'ngbd-widget-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demo.component.html'
})
export class NgbdWidgetDemoComponent {
  @Input() demoTitle: string;
  @Input() component: string;
  @Input() id: string;
  @Input() code: string;
  @Input() markup: string;
  @Input() files: { name: string; source: string }[];
  @Input() showCode = false;

  get hasManyFiles() {
    return this.files && this.files.length > 5;
  }

  constructor(private _analytics: Analytics) {}

  tabType(name: string) {
    const ext = name.split('.').pop();
    return (
      {
        html: 'HTML',
        scss: 'Style (SCSS)',
        css: 'Style (CSS)',
        ts: 'Typescript'
      }[ext] || 'Code'
    );
  }

  trackStackBlitzClick() {
    this._analytics.trackEvent(
      'StackBlitz View',
      this.component + ' ' + this.id
    );
  }
  trackShowCodeClick() {
    if (this.showCode) {
      this._analytics.trackEvent(
        'Show Code View',
        this.component + ' ' + this.id
      );
    }
  }
}
