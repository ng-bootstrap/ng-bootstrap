import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Analytics} from '../../../shared/analytics/analytics';

@Component({
  selector: 'ngbd-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overview-component">
      <ng-content></ng-content>
    </div>
  `,
})

export class NgbdOverviewComponent {

  constructor(private _analytics: Analytics) {
  }
}
