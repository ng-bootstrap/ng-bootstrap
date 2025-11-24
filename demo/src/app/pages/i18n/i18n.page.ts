import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbdPageWrapper } from '../../shared/page-wrapper/page-wrapper.component';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgbdPageWrapper, NgbAlert],
	templateUrl: './i18n.page.html',
})
export class I18nPage {}
