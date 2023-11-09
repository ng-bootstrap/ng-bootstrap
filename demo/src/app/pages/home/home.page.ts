import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Snippet } from '../../services/snippet';
import { CodeComponent } from '../../shared/code.component';
import { RouterLink } from '@angular/router';
import { NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-home',
	standalone: true,
	imports: [CodeComponent, RouterLink, NgbAlertModule, NgbAlert],
	templateUrl: './home.page.html',
})
export class HomePage {
	version = environment.version;

	installation = Snippet({
		lang: 'text',
		code: `ng add @ng-bootstrap/ng-bootstrap`,
	});
}
