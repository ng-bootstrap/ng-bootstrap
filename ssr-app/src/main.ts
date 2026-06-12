import { provideBrowserGlobalErrorListeners } from '@angular/core';
/// <reference types="@angular/localize" />

import { AppComponent } from './app/app.component';
import { bootstrapApplication, provideClientHydration, withNoIncrementalHydration } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
	providers: [provideBrowserGlobalErrorListeners(), provideClientHydration(withNoIncrementalHydration())],
}).catch((err) => console.error(err));
