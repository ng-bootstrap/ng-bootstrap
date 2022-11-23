import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { ROUTES } from './app/routes';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideHttpClient, withNoXsrfProtection } from '@angular/common/http';

bootstrapApplication(AppComponent, {
	providers: [
		provideRouter(ROUTES, withPreloading(PreloadAllModules)),
		{
			provide: LocationStrategy,
			useClass: HashLocationStrategy,
		},
		provideHttpClient(withNoXsrfProtection()),
	],
}).catch((err) => console.error(err));
