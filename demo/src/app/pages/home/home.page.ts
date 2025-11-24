import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LIB_VERSIONS } from '../../tokens';
import { Snippet } from '../../services/snippet';
import { CodeComponent } from '../../shared/code.component';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'ngbd-home',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CodeComponent, RouterLink],
	templateUrl: './home.page.html',
})
export class HomePage {
	version = inject(LIB_VERSIONS).ngBootstrap;

	installation = Snippet({
		lang: 'text',
		code: `ng add @ng-bootstrap/ng-bootstrap`,
	});
}
