import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgbdDemoVersionsComponent } from './demo-versions.component';
import { NgbdDemoThemeComponent } from './demo-theme.component';

import { COMPONENT_LIST } from './shared/component-list';
import { AsyncPipe } from '@angular/common';
import { NPM_VIEWS } from './tokens';

@Component({
	standalone: true,
	selector: 'ngbd-app',
	templateUrl: './app.component.html',
	imports: [RouterLink, RouterLinkActive, RouterOutlet, NgbdDemoVersionsComponent, NgbdDemoThemeComponent, AsyncPipe],
})
export class AppComponent {
	components = COMPONENT_LIST;
	downloadCount = inject(NPM_VIEWS);
	navbarCollapsed = true;
}
