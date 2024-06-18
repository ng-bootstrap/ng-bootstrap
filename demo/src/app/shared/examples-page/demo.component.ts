import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';

import { AnalyticsService } from '../../services/analytics.service';
import { Snippet } from '../../services/snippet';
import { RouterLink } from '@angular/router';
import { LowerCasePipe } from '@angular/common';
import { CodeComponent } from '../code.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdDemoCodeService } from '../../services/demo-code.service';

const TYPES: { [name: string]: string } = {
	html: 'HTML',
	scss: 'Style (SCSS)',
	css: 'Style (CSS)',
	ts: 'Typescript',
};

@Component({
	selector: 'ngbd-widget-demo',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, CodeComponent, NgbNavModule, LowerCasePipe],
	templateUrl: './demo.component.html',
})
export class NgbdWidgetDemoComponent {
	private _analytics = inject(AnalyticsService);
	private _codeService = inject(NgbdDemoCodeService);

	demoTitle = input.required<string>();
	component = input.required<string>();
	fragment = input.required<string>();
	code = input<string>();
	markup = input<string>();
	files = input<{ name: string; source: string }[]>();
	showStackblitz = input<boolean>();

	showCode = signal(false);

	markupSnippet = computed(() => Snippet({ lang: 'html', code: this._codeService.getDemoSource(this.markup()) }));
	codeSnippet = computed(() => Snippet({ lang: 'typescript', code: this._codeService.getDemoSource(this.code()) }));

	filesWithSnippets = computed(() =>
		(this.files() || []).map(({ source, name }) => ({
			source,
			name,
			snippet: Snippet({ code: this._codeService.getDemoSource(source), lang: name.split('.').pop() || '' }),
		})),
	);

	hasManyFiles = computed(() => (this.files() || []).length > 5);

	tabType(name: string) {
		return TYPES[name.split('.').pop() || ''] || 'Code';
	}

	trackStackBlitzClick() {
		this._analytics.trackClick('open_demo_stackblitz', {
			component_name: this.component().toLowerCase(),
			demo_name: this.fragment(),
		});
	}
	trackShowCodeClick() {
		if (this.showCode()) {
			this._analytics.trackClick('ngb_open_demo_source', {
				component: this.component().toLowerCase(),
				demo_name: this.fragment(),
			});
		}
	}
}
