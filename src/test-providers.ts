import { provideZoneChangeDetection } from '@angular/core';
import { NgbConfig } from './config/ngb-config';

export default [provideZoneChangeDetection(), { provide: NgbConfig, useValue: { animation: false } }];
