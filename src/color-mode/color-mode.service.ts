import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, InjectionToken, signal } from '@angular/core';

export type ColorMode = 'light' | 'dark' | 'auto';

export type ColorModeConfig = {
	defaultColorMode: ColorMode;
	saveToLocalStorage: boolean;
	localStorageKey: string;
};

export const ColorModeConfigDefaults: ColorModeConfig = {
	defaultColorMode: 'auto',
	saveToLocalStorage: true,
	localStorageKey: 'bs_preferred_color_mode',
};

export const NG_COLORMODE_CONFIG = new InjectionToken<ColorModeConfig>('Color mode settings', {
	factory: () => ColorModeConfigDefaults,
});

/**
 * Service to manage the color mode (light, dark, auto) of the application.
 * It provides methods to initialize and set the color mode, and handles
 * storing the preference in local storage if configured.
 *
 * @example
 * Inject the service via provideColorMode() in the app.config file or import the ColorModeModule in main AppModule
 *
 * // inject ColorModeService
 * private colorModeService = inject(ColorModeService)
 *
 * // Set the color mode manually to dark
 * this.colorModeService.setColorMode('dark');
 *
 * // Obtain the current color mode (signal based)
 * currentColorMode = this.colorModeService.colorMode
 *
 * @providedIn 'root'
 */
@Injectable({
	providedIn: 'root',
})
export class NgbColorModeService {
	private document = inject(DOCUMENT);
	private settings = inject(NG_COLORMODE_CONFIG);

	private systemPreffersColorScheme = signal<ColorMode>(
		window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
	);
	private defaultColorMode: ColorMode = 'auto';
	private colorMode = signal<ColorMode>('auto');

	currentColorMode = computed(() => this.colorMode());

	private getColorModeLS(): string | null {
		return localStorage.getItem(this.settings.localStorageKey);
	}

	private setColorModeLS(colorMode: ColorMode) {
		localStorage.setItem(this.settings.localStorageKey, colorMode);
	}

	/**
	 * Initialize the color mode. Service should be initialized during the APP Initialization
	 */
	initialize() {
		const colorMode = this.getColorModeLS() ?? this.defaultColorMode;
		this.setColorMode(colorMode as ColorMode);

		this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
			this.systemPreffersColorScheme.set(e.matches ? 'dark' : 'light');
			this.setColorMode();
		});
	}

	/**
	 * Set the color mode to an 'html' element and set the local storage with the preference of the color mode
	 * @param mode
	 */
	setColorMode(colorMode?: ColorMode): void {
		if (colorMode) {
			this.colorMode.set(colorMode);
			if (this.settings.saveToLocalStorage) {
				this.setColorModeLS(colorMode);
			}
		}

		const bsDomeTheme = this.currentColorMode() === 'auto' ? this.systemPreffersColorScheme() : this.currentColorMode();
		const documentElement = this.document.documentElement;
		if (documentElement) {
			documentElement.setAttribute('data-bs-theme', bsDomeTheme);
		}
	}
}
