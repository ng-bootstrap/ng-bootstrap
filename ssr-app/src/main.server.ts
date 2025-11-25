import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideServerRendering } from '@angular/ssr';
/// <reference types="@angular/localize" />

import { bootstrapApplication, provideClientHydration, BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

const bootstrap = (context: BootstrapContext) =>
	bootstrapApplication(
		AppComponent,
		{
			providers: [provideBrowserGlobalErrorListeners(), provideServerRendering(), provideClientHydration()],
		},
		context,
	);

export default bootstrap;
