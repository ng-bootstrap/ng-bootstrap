import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

interface Theme {
	id: 'auto' | 'light' | 'dark';
	name: string;
	icon: string;
}

const PREFERS_COLOR_SCHEME_DARK = window.matchMedia('(prefers-color-scheme: dark)');

const THEMES: Theme[] = [
	{ id: 'auto', name: 'Auto', icon: 'bi-circle-half' },
	{ id: 'light', name: 'Light', icon: 'bi-sun-fill' },
	{ id: 'dark', name: 'Dark', icon: 'bi-moon-stars-fill' },
];

@Component({
	selector: 'ngbd-theme-picker',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgbDropdownModule],
	template: `
		<div class="nav-item" ngbDropdown>
			<a class="nav-link" ngbDropdownToggle id="demo-site-theme" role="button">
				<span class="bi {{ current().icon }}"></span>
			</a>
			<div ngbDropdownMenu aria-labelledby="demo-site-theme" class="dropdown-menu dropdown-menu-end">
				@for (theme of themes(); track theme) {
					<button ngbDropdownItem [class.active]="theme.id === current().id" (click)="preferred.set(theme.id)">
						<span class="bi {{ theme.icon }} me-2"></span>{{ theme.name }}
					</button>
				}
			</div>
		</div>
	`,
})
export class ThemePickerComponent {
	themes = signal(THEMES).asReadonly();
	preferred = signal(localStorage.getItem('theme') || this.themes()[0].id);
	current = computed(() => this.themes().find((t) => t.id === this.preferred()) || this.themes()[0]);
	systemTheme = signal(PREFERS_COLOR_SCHEME_DARK.matches ? 'dark' : 'light');
	dataBsTheme = computed(() => (this.current().id === 'auto' ? this.systemTheme()! : this.current().id));

	constructor() {
		// save preferred theme in local storage when it changes
		effect(() => localStorage.setItem('theme', this.preferred()));

		// updating current theme in DOM
		effect(() => document.documentElement.setAttribute('data-bs-theme', this.dataBsTheme()));

		// listening to system theme changes, could be done with RxJS, but this is simpler
		PREFERS_COLOR_SCHEME_DARK.addEventListener('change', (event) =>
			this.systemTheme.set(event.matches ? 'dark' : 'light'),
		);
	}
}
