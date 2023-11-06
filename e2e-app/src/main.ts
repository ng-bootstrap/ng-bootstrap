/// <reference types="@angular/localize" />

import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { ROUTES } from './app/app.routes';

bootstrapApplication(AppComponent, {
	providers: [provideRouter(ROUTES, withHashLocation())],
}).catch((err) => console.log(err));
