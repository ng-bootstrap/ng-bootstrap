import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {
	PreloadAllModules,
	provideRouter,
	withHashLocation,
	withInMemoryScrolling,
	withPreloading,
} from '@angular/router';
import { ROUTES } from './app/routes';
import { provideHttpClient, withNoXsrfProtection } from '@angular/common/http';

bootstrapApplication(AppComponent, {
	providers: [
		provideRouter(
			ROUTES,
			withPreloading(PreloadAllModules),
			withHashLocation(),
			withInMemoryScrolling({
				anchorScrolling: 'enabled',
				scrollPositionRestoration: 'enabled',
			}),
		),
		provideHttpClient(withNoXsrfProtection()),
	],
}).catch((err) => console.error(err));
