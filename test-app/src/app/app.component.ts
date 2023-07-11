import { Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [NgbModule],
	template: `
		<div class="container">
			<ngb-alert type="success" [dismissible]="false">
				This is a minimal CLI app for issue reproduction purposes
			</ngb-alert>
		</div>
	`,
})
export class AppComponent {}
