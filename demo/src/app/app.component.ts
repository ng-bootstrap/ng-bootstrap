import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { VersionPickerComponent } from './shared/version-picker.component';
import { ThemePickerComponent } from './shared/theme-picker.component';

import { COMPONENTS } from './components';
import { AsyncPipe } from '@angular/common';
import { NPM_VIEWS } from './tokens';

@Component({
	standalone: true,
	selector: 'ngbd-app',
	templateUrl: './app.component.html',
	imports: [RouterLink, RouterLinkActive, RouterOutlet, VersionPickerComponent, ThemePickerComponent, AsyncPipe],
})
export class AppComponent {
	components = COMPONENTS;
	downloadCount = inject(NPM_VIEWS);
	navbarCollapsed = true;
}
