import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { ROUTES } from './app/routes';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// depending on the env mode, enable prod mode or add debugging modules
if (environment.production) {
	enableProdMode();
}

bootstrapApplication(AppComponent, {
	providers: [
		provideRouter(ROUTES, withPreloading(PreloadAllModules)),
		{
			provide: LocationStrategy,
			useClass: HashLocationStrategy,
		},
		importProvidersFrom([HttpClientModule]),
	],
}).catch((err) => console.error(err));
