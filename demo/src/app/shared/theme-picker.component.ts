import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

interface Theme {
	id: string;
	name: string;
	icon: string;
}

@Component({
	selector: 'ngbd-theme-picker',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgbDropdownModule],
	template: `
		<div class="nav-item" ngbDropdown>
			<a class="nav-link" ngbDropdownToggle id="demo-site-theme" role="button">
				<span class="bi bi-{{ currentTheme.icon }}"></span>
			</a>
			<div ngbDropdownMenu aria-labelledby="demo-site-theme" class="dropdown-menu dropdown-menu-end">
				@for (theme of themes; track theme) {
					<button ngbDropdownItem [class.active]="theme.id === currentTheme.id" (click)="setTheme(theme)">
						<span class="bi bi-{{ theme.icon }} me-2"></span>{{ theme.name }}
					</button>
				}
			</div>
		</div>
	`,
})
export class ThemePickerComponent {
	themes: Theme[] = [
		{ id: 'auto', name: 'Auto', icon: 'circle-half' },
		{ id: 'light', name: 'Light', icon: 'sun-fill' },
		{ id: 'dark', name: 'Dark', icon: 'moon-stars-fill' },
	];
	currentTheme: Theme = { id: 'auto', name: 'auto', icon: 'circle-half' };

	constructor() {
		const theme = this.themes.find((t) => t.id === localStorage.getItem('theme'));
		if (theme) {
			this.currentTheme = theme;
		}
		this.setTheme(this.getPreferredTheme());

		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
			if (this.currentTheme.id !== 'light' || this.currentTheme.id !== ('dark' as any)) {
				this.setTheme(this.getPreferredTheme());
			}
		});
	}

	getPreferredTheme(): Theme {
		if (this.currentTheme) {
			return this.currentTheme;
		} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			return this.themes.find((t) => t.id === 'dark')!;
		} else {
			return this.themes.find((t) => t.id === 'light')!;
		}
	}

	setTheme(theme: Theme): void {
		this.currentTheme = theme;
		localStorage.setItem('theme', theme.id);
		if (theme.id === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			document.documentElement.setAttribute('data-bs-theme', 'dark');
		} else {
			document.documentElement.setAttribute('data-bs-theme', theme.id);
		}
	}
}
