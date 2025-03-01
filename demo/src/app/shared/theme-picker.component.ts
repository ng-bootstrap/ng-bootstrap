import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ColorMode, ColorModeService, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

interface Theme {
	id: ColorMode;
	name: string;
	icon: string;
}

const THEMES: Theme[] = [
	{ id: 'auto', name: 'Auto', icon: 'bi-circle-half' },
	{ id: 'light', name: 'Light', icon: 'bi-sun-fill' },
	{ id: 'dark', name: 'Dark', icon: 'bi-moon-stars-fill' },
];

@Component({
	selector: 'ngbd-theme-picker',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgbDropdownModule],
	template: `
		<div class="nav-item" ngbDropdown>
			<a class="nav-link" ngbDropdownToggle id="demo-site-theme" role="button">
				<span class="bi {{ current().icon }}"></span>
			</a>
			<div ngbDropdownMenu aria-labelledby="demo-site-theme" class="dropdown-menu dropdown-menu-end">
				@for (theme of themes(); track theme) {
					<button ngbDropdownItem [class.active]="theme.id === current().id" (click)="setColorMode(theme.id)">
						<span class="bi {{ theme.icon }} me-2"></span>{{ theme.name }}
					</button>
				}
			</div>
		</div>
	`,
})
export class ThemePickerComponent {
	private colorModeService = inject(ColorModeService);

	themes = signal(THEMES).asReadonly();

	current = computed(
		() => this.themes().find((t) => t.id === this.colorModeService.currentColorMode()) ?? this.themes[0],
	);
	setColorMode(themeId: Theme['id']) {
		this.colorModeService.setColorMode(themeId);
	}
}
