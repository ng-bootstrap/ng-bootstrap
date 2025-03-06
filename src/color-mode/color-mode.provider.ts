import { EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';

import {
	ColorModeConfig,
	ColorModeConfigDefaults,
	NG_COLORMODE_CONFIG,
	NgbColorModeService,
} from './color-mode.service';

/**
 * Provides the color mode configuration for the application.
 *
 * This function sets up the necessary providers for the color mode configuration
 * and initializes the color mode service.
 *
 * @param options - An optional partial configuration object to override the default color mode settings.
 * @returns An array of environment providers required for the color mode configuration.
 */
export function provideColorMode(options?: Partial<ColorModeConfig>): EnvironmentProviders[] {
	return [
		makeEnvironmentProviders([
			{
				provide: NG_COLORMODE_CONFIG,
				useValue: {
					...ColorModeConfigDefaults,
					...options,
				},
			},
		]),
		provideAppInitializer(() => {
			const colorModeService = inject(NgbColorModeService);
			return colorModeService.initialize();
		}),
	];
}
