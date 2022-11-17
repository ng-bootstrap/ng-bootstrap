import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbdPageWrapper } from '../../shared/page-wrapper/page-wrapper.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	standalone: true,
	imports: [NgbdPageWrapper, NgbAlertModule],
	templateUrl: './i18n.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class I18nPage {}
