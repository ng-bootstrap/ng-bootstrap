import { ModuleWithProviders, NgModule } from '@angular/core';

import { provideColorMode } from './color-mode.provider';
import { ColorModeConfig } from './color-mode.service';

/**
 * The `ColorModeModule` is an Angular module that provides color mode configuration and services.
 *
 * This module can be imported into your Angular application to enable color mode functionality.
 *
 * @example
 * // Importing the module in your application
 * import { ColorModeModule } from './color-mode/color-mode.module';
 *
 * @NgModule({
 *   imports: [
 *     ColorModeModule,
 *   ],
 * })
 *
 * or with configurations
 *
 * @NgModule({
 *   imports: [
 *     ColorModeModule.forRoot({
 *       	defaultColorMode: 'auto',
 *				saveToLocalStorage: true,
 *				localStorageKey: 'bs_preferred_color_mode',
 *     }),
 *   ],
 * })
 * export class AppModule {}
 *
 * @module
 */
@NgModule({
	providers: provideColorMode(),
})
export class ColorModeModule {
	static forRoot(options?: Partial<ColorModeConfig>): ModuleWithProviders<ColorModeModule> {
		return {
			ngModule: ColorModeModule,
			providers: provideColorMode(options),
		};
	}
}
