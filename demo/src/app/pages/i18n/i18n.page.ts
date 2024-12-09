import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbdPageWrapper } from '../../shared/page-wrapper/page-wrapper.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgbdPageWrapper, NgbAlertModule],
    templateUrl: './i18n.page.html'
})
export class I18nPage {}
