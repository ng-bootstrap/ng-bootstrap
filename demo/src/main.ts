/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {
	PreloadAllModules,
	provideRouter,
	withComponentInputBinding,
	withHashLocation,
	withInMemoryScrolling,
	withPreloading,
} from '@angular/router';
import { ROUTES } from './app/routes';
import { provideHttpClient, withNoXsrfProtection } from '@angular/common/http';
import { APP_INITIALIZER, inject, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { AnalyticsService } from './app/services/analytics.service';

bootstrapApplication(AppComponent, {
	providers: [
		provideRouter(
			ROUTES,
			withPreloading(PreloadAllModules),
			withHashLocation(),
			withComponentInputBinding(),
			withInMemoryScrolling({
				anchorScrolling: 'enabled',
				scrollPositionRestoration: 'enabled',
			}),
		),
		provideHttpClient(withNoXsrfProtection()),
		provideExperimentalZonelessChangeDetection(),
		{
			provide: APP_INITIALIZER,
			useFactory: () => {
				inject(AnalyticsService).start();
			},
		},
	],
}).catch((err) => console.error(err));
