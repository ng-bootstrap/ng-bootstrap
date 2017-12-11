import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {NgbdModule} from './app/app.module';

// depending on the env mode, enable prod mode or add debugging modules
if (process.env.NODE_ENV === 'production') {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(NgbdModule);
