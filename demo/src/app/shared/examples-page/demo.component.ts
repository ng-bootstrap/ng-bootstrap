import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AnalyticsService } from '../../services/analytics.service';
import { ISnippet, Snippet } from '../../services/snippet';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { NgbdCodeComponent } from '../code/code.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdFragment } from '../fragment/fragment.directive';

const TYPES: { [name: string]: string } = {
	html: 'HTML',
	scss: 'Style (SCSS)',
	css: 'Style (CSS)',
	ts: 'Typescript',
};

@Component({
	selector: 'ngbd-widget-demo',
	standalone: true,
	imports: [RouterLink, NgIf, NgbdCodeComponent, NgbNavModule, NgFor, NgbdFragment],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './demo.component.html',
})
export class NgbdWidgetDemoComponent {
	@Input() demoTitle: string;
	@Input() component: string;
	@Input() id: string;
	@Input() code: string;
	@Input() markup: string;
	@Input() files: { name: string; source: string }[];
	@Input() showCode = false;
	@Input() showStackblitz;

	get markupSnippet() {
		return Snippet({ lang: 'html', code: this.markup });
	}
	get codeSnippet() {
		return Snippet({ lang: 'typescript', code: this.code });
	}

	getFileSnippet({ name, source }): ISnippet {
		return Snippet({ code: source, lang: name.split('.').pop() || '' });
	}

	get hasManyFiles() {
		return this.files && this.files.length > 5;
	}

	constructor(private _analytics: AnalyticsService) {}

	tabType(name: string) {
		return TYPES[name.split('.').pop() || ''] || 'Code';
	}

	trackStackBlitzClick() {
		this._analytics.trackEvent('StackBlitz View', this.component + ' ' + this.id);
	}
	trackShowCodeClick() {
		if (this.showCode) {
			this._analytics.trackEvent('Show Code View', this.component + ' ' + this.id);
		}
	}
}
