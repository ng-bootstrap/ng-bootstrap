import { provideZoneChangeDetection } from '@angular/core';
/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, { providers: [provideZoneChangeDetection()] }).catch((err) => console.error(err));
