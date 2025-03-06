/// <reference types="@angular/localize" />

import { provideHttpClient, withNoXsrfProtection } from '@angular/common/http';
import { inject, provideAppInitializer, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
	PreloadAllModules,
	provideRouter,
	withComponentInputBinding,
	withHashLocation,
	withInMemoryScrolling,
	withPreloading,
} from '@angular/router';
import { provideColorMode } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app/app.component';
import { ROUTES } from './app/routes';
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
		provideAppInitializer(() => inject(AnalyticsService).start()),
		provideColorMode(),
	],
}).catch((err) => console.error(err));
