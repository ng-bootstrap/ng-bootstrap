import { provideServerRendering } from '@angular/ssr';
/// <reference types="@angular/localize" />

import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

const bootstrap = () =>
	bootstrapApplication(AppComponent, {
		providers: [provideServerRendering(), provideClientHydration()],
	});

export default bootstrap;
