import {
	afterNextRender,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	Input,
	ViewChild,
} from '@angular/core';

import { ISnippet } from '../services/snippet';
import { CodeHighlightService } from '../services/code-highlight.service';

@Component({
	selector: 'ngbd-code',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: ` <pre class="language-{{ snippet.lang }}"><code #code class="language-{{ snippet.lang }}"></code></pre> `,
})
export class CodeComponent {
	@ViewChild('code', { static: true }) codeEl: ElementRef<HTMLElement>;

	@Input() snippet: ISnippet;

	constructor() {
		const highlightService = inject(CodeHighlightService);
		afterNextRender(() => {
			this.codeEl.nativeElement.innerHTML = highlightService.highlight(this.snippet.code, this.snippet.lang);
		});
	}
}
