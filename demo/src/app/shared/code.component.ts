import {
	afterNextRender,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	input,
	signal,
	viewChild,
} from '@angular/core';

import { ISnippet } from '../services/snippet';
import { CodeHighlightService } from '../services/code-highlight.service';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';

@Component({
	selector: 'ngbd-code',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgbTooltip],
	template: `
		<div class="position-relative">
			<button
				(click)="copyToClipboard()"
				[ngbTooltip]="showAsCopied() ? 'Copied!' : 'Copy to clipboard'"
				class="btn btn-clipboard position-absolute top-0 end-0 mt-2 me-3 z-2"
				aria-label="Copy code to clipboard"
			>
				<i class="bi bi-{{ showAsCopied() ? 'clipboard-check' : 'clipboard' }}"></i>
			</button>
			<pre class="language-{{ snippet().lang }}"><code #code class="language-{{ snippet().lang }}"></code></pre>
		</div>
	`,
})
export class CodeComponent {
	private _copyBtnTooltip = viewChild.required(NgbTooltip);
	private _codeEl = viewChild.required('code', { read: ElementRef });
	snippet = input.required<ISnippet>();

	showAsCopied = signal(false);

	constructor() {
		const highlightService = inject(CodeHighlightService);
		afterNextRender(() => {
			this._codeEl().nativeElement.innerHTML = highlightService.highlight(this.snippet().code, this.snippet().lang);
		});
	}

	copyToClipboard() {
		navigator.clipboard.writeText(this.snippet().code).then(() => {
			this.showAsCopied.set(true);

			// 'Restart' tooltip to show 'Copied!' message
			this._copyBtnTooltip().close();
			setTimeout(() => this._copyBtnTooltip().open(), 0);

			setTimeout(() => this.showAsCopied.set(false), 2000);
		});
	}
}
