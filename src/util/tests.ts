import {TestBed, ComponentFixture} from '@angular/core/testing';

export function createGenericTestComponent<T>(html: string, type: {new (...args: any[]): T}): ComponentFixture<T> {
  TestBed.overrideComponent(type, {set: {template: html}});
  const fixture = TestBed.createComponent(type);
  fixture.detectChanges();
  return fixture as ComponentFixture<T>;
}

type Browser = 'ie9' | 'ie10' | 'ie11' | 'ie' | 'edge' | 'chrome' | 'safari';

export function getBrowser(ua = window.navigator.userAgent) {
  let browser = 'unknown';

  // IE < 11
  const msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    return 'ie' + parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  // IE 11
  if (ua.indexOf('Trident/') > 0) {
    let rv = ua.indexOf('rv:');
    return 'ie' + parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  // Edge
  if (ua.indexOf('Edge/') > 0) {
    return 'edge';
  }

  // Chrome
  if (ua.indexOf('Chrome/') > 0) {
    return 'chrome';
  }

  // Safari
  if (ua.indexOf('Safari/') > 0) {
    return 'safari';
  }

  if (browser === 'unknown') {
    throw new Error('Browser detection failed for test exclusion');
  }

  return browser;
}

export function isBrowser(browsers: Browser | Browser[], ua = window.navigator.userAgent) {
  let browsersStr = Array.isArray(browsers) ? (browsers as Browser[]).map(x => x.toString()) : [browsers.toString()];
  let browser = getBrowser(ua);

  if (browsersStr.indexOf('ie') > -1 && browser.startsWith('ie')) {
    return true;
  } else {
    return browsersStr.indexOf(browser) > -1;
  }
}
