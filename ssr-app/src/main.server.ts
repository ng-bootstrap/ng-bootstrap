import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideServerRendering } from '@angular/ssr';
/// <reference types="@angular/localize" />

import {
	bootstrapApplication,
	provideClientHydration,
	BootstrapContext,
	withNoIncrementalHydration,
} from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

const bootstrap = (context: BootstrapContext) =>
	bootstrapApplication(
		AppComponent,
		{
			providers: [
				provideBrowserGlobalErrorListeners(),
				provideServerRendering(),
				provideClientHydration(withNoIncrementalHydration()),
			],
		},
		context,
	);

export default bootstrap;
