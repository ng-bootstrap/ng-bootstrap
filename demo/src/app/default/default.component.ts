import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { Snippet } from '../services/snippet';
import { NgbdCodeComponent } from '../shared/code/code.component';
import { RouterLink } from '@angular/router';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-default',
	standalone: true,
	imports: [NgbdCodeComponent, RouterLink, NgbAlertModule],
	templateUrl: './default.component.html',
})
export class DefaultComponent {
	version = environment.version;

	installation = Snippet({
		lang: 'text',
		code: `ng add @ng-bootstrap/ng-bootstrap`,
	});
}
