<a name="2.2.1"></a>
## [2.2.1](https://github.com/ng-bootstrap/ng-bootstrap/compare/2.2.0...2.2.1) (2018-07-27)


### Bug Fixes

* **dropdown:** close on escape from anywhere ([c26732f](https://github.com/ng-bootstrap/ng-bootstrap/commit/c26732f)), closes [#1741](https://github.com/ng-bootstrap/ng-bootstrap/issues/1741) [#2051](https://github.com/ng-bootstrap/ng-bootstrap/issues/2051)
* **dropdown:** remove global document click listener ([bd95f1f](https://github.com/ng-bootstrap/ng-bootstrap/commit/bd95f1f)), closes [#900](https://github.com/ng-bootstrap/ng-bootstrap/issues/900) [#2518](https://github.com/ng-bootstrap/ng-bootstrap/issues/2518) [#2871316695d8d2da5a8b0144c0a69de17e480019](https://github.com/ng-bootstrap/ng-bootstrap/issues/2871316695d8d2da5a8b0144c0a69de17e480019)
* **modal:** adjust modal background to avoid shifting ([efe01f1](https://github.com/ng-bootstrap/ng-bootstrap/commit/efe01f1)), closes [#641](https://github.com/ng-bootstrap/ng-bootstrap/issues/641) [#2508](https://github.com/ng-bootstrap/ng-bootstrap/issues/2508)
* **progressbar:** add missing i18n id specifier ([becb208](https://github.com/ng-bootstrap/ng-bootstrap/commit/becb208)), closes [#2493](https://github.com/ng-bootstrap/ng-bootstrap/issues/2493)
* **typeahead:** don't fail when user returns falsy results ([39a58a3](https://github.com/ng-bootstrap/ng-bootstrap/commit/39a58a3)), closes [#2530](https://github.com/ng-bootstrap/ng-bootstrap/issues/2530) [#2550](https://github.com/ng-bootstrap/ng-bootstrap/issues/2550)



<a name="3.0.0-beta.1"></a>
# [3.0.0-beta.1](https://github.com/ng-bootstrap/ng-bootstrap/compare/2.2.0...3.0.0-beta.1) (2018-07-06)


### Bug Fixes

* **dropdown:** close on escape from anywhere ([2495570](https://github.com/ng-bootstrap/ng-bootstrap/commit/2495570)), closes [#1741](https://github.com/ng-bootstrap/ng-bootstrap/issues/1741) [#2051](https://github.com/ng-bootstrap/ng-bootstrap/issues/2051)
* **progressbar:** add missing i18n id specifier ([69956fe](https://github.com/ng-bootstrap/ng-bootstrap/commit/69956fe)), closes [#2493](https://github.com/ng-bootstrap/ng-bootstrap/issues/2493)


### Features

* **datepicker:** close popup on outside click ([a9ab409](https://github.com/ng-bootstrap/ng-bootstrap/commit/a9ab409)), closes [#783](https://github.com/ng-bootstrap/ng-bootstrap/issues/783) [#2440](https://github.com/ng-bootstrap/ng-bootstrap/issues/2440)


### BREAKING CHANGES

* The library is now delivered in Angular Package Format (APF) v6.0 (https://goo.gl/jB3GVv) using @angular/cli 6.

One notable change is that delivered UMD bundle is now located in 'bundles/ng-bootstrap.umd.js' instead of 'bundles/ng-bootstrap.js'.

Also ES5 code is now delivered as a flat version by default, so 'module' in the 'package.json' is now poining to 'fesm5/ng-bootstrap.js' and not 'index.js'.
You can still find all the ES5 code in the 'esm5' folder if necessary.

Please examine the contents of the delivered package, if you have a custom build configuration.


* **datepicker:** datepicker popup will now close on outside click by default.

Because of this datepicker will NOT open with `(click)="d.open()"` and `(click)="d.toggle()"`
unless you mark the element with click handler with `[ngbDatepickerToggle]="d"`

BEFORE:
```html
<input ngbDatepicker #d="ngbDatepicker" />
<button (click)="d.toggle()">...</button>
<button (click)="d.open()">...</button>
```

AFTER:
```html
<input ngbDatepicker #d="ngbDatepicker" />
<button [ngbDatepickerToggle]="d" (click)="d.toggle()">...</button>
<button [ngbDatepickerToggle]="d" (click)="d.open()">...</button>
```

Also note that `[autoClose]` input now accepts additional 'inside' and 'outside' values.



<a name="2.2.0"></a>
# [2.2.0](https://github.com/ng-bootstrap/ng-bootstrap/compare/2.1.2...2.2.0) (2018-06-29)


### Bug Fixes

* **accordion:** update generated markup to Bootstrap HTML / CSS ([9b2b0bc](https://github.com/ng-bootstrap/ng-bootstrap/commit/9b2b0bc)), closes [#2368](https://github.com/ng-bootstrap/ng-bootstrap/issues/2368)


### Features

* **carousel:** add flags controlling display of navigation arrows and indicators ([ec4e939](https://github.com/ng-bootstrap/ng-bootstrap/commit/ec4e939)), closes [#2274](https://github.com/ng-bootstrap/ng-bootstrap/issues/2274) [#2275](https://github.com/ng-bootstrap/ng-bootstrap/issues/2275)
* **carousel:** add input to control pause on mouseover ([8d54cac](https://github.com/ng-bootstrap/ng-bootstrap/commit/8d54cac)), closes [#1163](https://github.com/ng-bootstrap/ng-bootstrap/issues/1163) [#2436](https://github.com/ng-bootstrap/ng-bootstrap/issues/2436)
* **modal:** aria-labelledby attribute for modal window ([3cc6fa7](https://github.com/ng-bootstrap/ng-bootstrap/commit/3cc6fa7)), closes [#1477](https://github.com/ng-bootstrap/ng-bootstrap/issues/1477) [#2049](https://github.com/ng-bootstrap/ng-bootstrap/issues/2049)
* **popover:** ability to add custom CSS classes to pover window ([483bd05](https://github.com/ng-bootstrap/ng-bootstrap/commit/483bd05)), closes [#1441](https://github.com/ng-bootstrap/ng-bootstrap/issues/1441) [#2310](https://github.com/ng-bootstrap/ng-bootstrap/issues/2310)
* **timepicker:** add custom time adapter support ([7eaa7e7](https://github.com/ng-bootstrap/ng-bootstrap/commit/7eaa7e7)), closes [#545](https://github.com/ng-bootstrap/ng-bootstrap/issues/545) [#2347](https://github.com/ng-bootstrap/ng-bootstrap/issues/2347)



<a name="2.1.2"></a>
## [2.1.2](https://github.com/ng-bootstrap/ng-bootstrap/compare/2.1.1...2.1.2) (2018-06-22)


### Bug Fixes

* **datepicker:** fix ExpressionChangedAfterItHasBeenCheckedError when switching between months ([b47f981](https://github.com/ng-bootstrap/ng-bootstrap/commit/b47f981)), closes [#2408](https://github.com/ng-bootstrap/ng-bootstrap/issues/2408) [#2462](https://github.com/ng-bootstrap/ng-bootstrap/issues/2462)
* **timepicker:** fix placeholder width issues on iOS ([e65d5cf](https://github.com/ng-bootstrap/ng-bootstrap/commit/e65d5cf)), closes [#2460](https://github.com/ng-bootstrap/ng-bootstrap/issues/2460)



<a name="2.1.1"></a>
## [2.1.1](https://github.com/ng-bootstrap/ng-bootstrap/compare/2.1.0...2.1.1) (2018-06-15)


### Bug Fixes

* **datepicker:** properly display month select box when 'displayMonths' > 1 ([18acd62](https://github.com/ng-bootstrap/ng-bootstrap/commit/18acd62)), closes [#2377](https://github.com/ng-bootstrap/ng-bootstrap/issues/2377) [#2452](https://github.com/ng-bootstrap/ng-bootstrap/issues/2452)
* **live:** use a single DOM element for Live Announcer ([31968ad](https://github.com/ng-bootstrap/ng-bootstrap/commit/31968ad)), closes [#2458](https://github.com/ng-bootstrap/ng-bootstrap/issues/2458)
* **positioning:** add missing primary position checks ([54168ea](https://github.com/ng-bootstrap/ng-bootstrap/commit/54168ea))
* **positioning:** add secondary positions to auto conversion ([7208006](https://github.com/ng-bootstrap/ng-bootstrap/commit/7208006)), closes [#1899](https://github.com/ng-bootstrap/ng-bootstrap/issues/1899)



<a name="2.1.0"></a>
# [2.1.0](https://github.com/ng-bootstrap/ng-bootstrap/compare/2.0.0...2.1.0) (2018-06-08)


### Bug Fixes

* **datepicker:** display 'outsideDays' correctly for multiple months ([26b8f3b](https://github.com/ng-bootstrap/ng-bootstrap/commit/26b8f3b)), closes [#2421](https://github.com/ng-bootstrap/ng-bootstrap/issues/2421) [#2035](https://github.com/ng-bootstrap/ng-bootstrap/issues/2035)
* **datepicker:** fix month/year select boxes widths in IE10 ([f266b7f](https://github.com/ng-bootstrap/ng-bootstrap/commit/f266b7f)), closes [#2414](https://github.com/ng-bootstrap/ng-bootstrap/issues/2414)
* use correct rxjs imports for focus trap ([2315c8c](https://github.com/ng-bootstrap/ng-bootstrap/commit/2315c8c)), closes [#2439](https://github.com/ng-bootstrap/ng-bootstrap/issues/2439)
* **datepicker:** fix select width with bootsrap 4.1 ([342b640](https://github.com/ng-bootstrap/ng-bootstrap/commit/342b640)), closes [#2443](https://github.com/ng-bootstrap/ng-bootstrap/issues/2443)
* **datepicker:** prevent focustrap to resotre focus on destroy ([dcd7111](https://github.com/ng-bootstrap/ng-bootstrap/commit/dcd7111)), closes [#2372](https://github.com/ng-bootstrap/ng-bootstrap/issues/2372) [#2392](https://github.com/ng-bootstrap/ng-bootstrap/issues/2392)
* **datepicker:** simplify CSS and navigation styles ([d349edb](https://github.com/ng-bootstrap/ng-bootstrap/commit/d349edb)), closes [#2401](https://github.com/ng-bootstrap/ng-bootstrap/issues/2401) [#2402](https://github.com/ng-bootstrap/ng-bootstrap/issues/2402)
* **datepicker:** simplify focus trap with observables ([25c1394](https://github.com/ng-bootstrap/ng-bootstrap/commit/25c1394)), closes [#2419](https://github.com/ng-bootstrap/ng-bootstrap/issues/2419) [#2406](https://github.com/ng-bootstrap/ng-bootstrap/issues/2406) [#2390](https://github.com/ng-bootstrap/ng-bootstrap/issues/2390) [#2372](https://github.com/ng-bootstrap/ng-bootstrap/issues/2372)
* **typeahead:** use custom input formatter with falsy values ([b73f350](https://github.com/ng-bootstrap/ng-bootstrap/commit/b73f350)), closes [#2389](https://github.com/ng-bootstrap/ng-bootstrap/issues/2389) [#2399](https://github.com/ng-bootstrap/ng-bootstrap/issues/2399)


### Features

* add support for i18n of static text in component templates ([65c232d](https://github.com/ng-bootstrap/ng-bootstrap/commit/65c232d)), closes [#2314](https://github.com/ng-bootstrap/ng-bootstrap/issues/2314) [#2317](https://github.com/ng-bootstrap/ng-bootstrap/issues/2317)
* **datepicker:** add aria attributes for navigation ([cd01d32](https://github.com/ng-bootstrap/ng-bootstrap/commit/cd01d32)), closes [#2345](https://github.com/ng-bootstrap/ng-bootstrap/issues/2345)
* **datepicker:** add native js date adapter ([cd14b96](https://github.com/ng-bootstrap/ng-bootstrap/commit/cd14b96)), closes [#2305](https://github.com/ng-bootstrap/ng-bootstrap/issues/2305)
* **datepicker:** close datepicker popup on ESC from anywhere ([2666d8b](https://github.com/ng-bootstrap/ng-bootstrap/commit/2666d8b)), closes [#2432](https://github.com/ng-bootstrap/ng-bootstrap/issues/2432)
* **modal:** focus is now trapped inside any opened modal ([cf48325](https://github.com/ng-bootstrap/ng-bootstrap/commit/cf48325)), closes [#642](https://github.com/ng-bootstrap/ng-bootstrap/issues/642) [#2441](https://github.com/ng-bootstrap/ng-bootstrap/issues/2441)
* **modal:** support for promises in beforeDismiss hook ([cca789f](https://github.com/ng-bootstrap/ng-bootstrap/commit/cca789f)), closes [#2340](https://github.com/ng-bootstrap/ng-bootstrap/issues/2340)
* **typeahead:** add input reflecting the 'autocomplete' attribute ([3a7ca58](https://github.com/ng-bootstrap/ng-bootstrap/commit/3a7ca58)), closes [#2194](https://github.com/ng-bootstrap/ng-bootstrap/issues/2194) [#2366](https://github.com/ng-bootstrap/ng-bootstrap/issues/2366)



<a name="2.0.0"></a>
# [2.0.0](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.1.1...2.0.0) (2018-05-04)

This is a major release of ng-bootstrap. It is fully compatible with Angular / RxJS 6.x.
Please pay attention to the breaking changes section when upgrading.

### Bug Fixes

* **accordion:** add 'accordion' css class ([d014d0e](https://github.com/ng-bootstrap/ng-bootstrap/commit/d014d0e)), closes [#2304](https://github.com/ng-bootstrap/ng-bootstrap/issues/2304)
* **accordion:** remove active class from open panel titles ([f804649](https://github.com/ng-bootstrap/ng-bootstrap/commit/f804649)), closes [#2307](https://github.com/ng-bootstrap/ng-bootstrap/issues/2307) [#2221](https://github.com/ng-bootstrap/ng-bootstrap/issues/2221)
* **datepicker:** allow weekday and week number css to be overridden ([57bf8f8](https://github.com/ng-bootstrap/ng-bootstrap/commit/57bf8f8)), closes [#2296](https://github.com/ng-bootstrap/ng-bootstrap/issues/2296)
* **dropdown:** correct dropup position with Bootstrap 4.1 ([91c166d](https://github.com/ng-bootstrap/ng-bootstrap/commit/91c166d)), closes [#2297](https://github.com/ng-bootstrap/ng-bootstrap/issues/2297) [#2313](https://github.com/ng-bootstrap/ng-bootstrap/issues/2313)
* **modal:** don't use deprecated 'ReflectiveInjector' ([0f8055f](https://github.com/ng-bootstrap/ng-bootstrap/commit/0f8055f)), closes [#2285](https://github.com/ng-bootstrap/ng-bootstrap/issues/2285)
* **typeahead:** reset active index when results change ([46a4b3b](https://github.com/ng-bootstrap/ng-bootstrap/commit/46a4b3b)), closes [#2303](https://github.com/ng-bootstrap/ng-bootstrap/issues/2303) [#2312](https://github.com/ng-bootstrap/ng-bootstrap/issues/2312)


### Features

* focustrap standalone service ([6961cb3](https://github.com/ng-bootstrap/ng-bootstrap/commit/6961cb3)), closes [#2322](https://github.com/ng-bootstrap/ng-bootstrap/issues/2322)
* **datepicker:** add 'aria-label' attribute for days ([d52059b](https://github.com/ng-bootstrap/ng-bootstrap/commit/d52059b)), closes [#2319](https://github.com/ng-bootstrap/ng-bootstrap/issues/2319)
* **datepicker:** allow focusing calendar days and navigation separately ([2daf038](https://github.com/ng-bootstrap/ng-bootstrap/commit/2daf038)), closes [#1716](https://github.com/ng-bootstrap/ng-bootstrap/issues/1716) [#2270](https://github.com/ng-bootstrap/ng-bootstrap/issues/2270)
* **datepicker:** focustrap for datepicker in popup ([e7179cd](https://github.com/ng-bootstrap/ng-bootstrap/commit/e7179cd)), closes [#2332](https://github.com/ng-bootstrap/ng-bootstrap/issues/2332)
* **datepicker:** use the angular locale API ([7959a15](https://github.com/ng-bootstrap/ng-bootstrap/commit/7959a15)), closes [#2065](https://github.com/ng-bootstrap/ng-bootstrap/issues/2065) [#2066](https://github.com/ng-bootstrap/ng-bootstrap/issues/2066)
* **popover:** conditional popover ([9de58e6](https://github.com/ng-bootstrap/ng-bootstrap/commit/9de58e6)), closes [#2188](https://github.com/ng-bootstrap/ng-bootstrap/issues/2188) [#2217](https://github.com/ng-bootstrap/ng-bootstrap/issues/2217)
* **typeahead:** accessibility, options summary status message ([f65b8a4](https://github.com/ng-bootstrap/ng-bootstrap/commit/f65b8a4)), closes [#2197](https://github.com/ng-bootstrap/ng-bootstrap/issues/2197) [#1945](https://github.com/ng-bootstrap/ng-bootstrap/issues/1945)


### BREAKING CHANGES

* **datepicker:** if you're using a custom `NgbDatepickerI18n` implementation, you'll have to implement an additional method: `getDayAriaLabel(date: NgbDateStruct): string`. It returns the string that will be set for the `aria-label` attribute for each displayed day. If you're not using the custom service, the `aria-label` will default to the value returned by the angular `DatePipe` with `'fullDate'` format.
* **accordion:** The "active" CSS class is no longer added to headers of an active panel.
This change assures that markup used by ng-bootstrap is in-line with the
markup described in:
https://getbootstrap.com/docs/4.0/components/collapse/#accordion-example
* **popover:** Popovers with an empty title and content are considered disabled and won't open by default.
* **datepicker:** The datepicker is no longer focusable as a whole component. Instead, the focus is allowed on each element inside the datepicker (navigation buttons, select boxes, focusable day) in the natural order. The datepicker `.focus()` method will now only focus one day and not the whole component.
* **datepicker:** if your application provides a LOCALE_ID other than
the default en-US, registers the locale data for this locale, and
doesn't use a custom NgbDatepickerI18n, then the days and months
of the datepicker won't be displayed in English anymore, but in the
langguage of the provided locale.



<a name="1.1.1"></a>
## [1.1.1](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.1.0...1.1.1) (2018-04-06)


### Bug Fixes

* **datepicker:** emit 'selectEvent' when datepicker model changes ([4a0ec89](https://github.com/ng-bootstrap/ng-bootstrap/commit/4a0ec89)), closes [#2278](https://github.com/ng-bootstrap/ng-bootstrap/issues/2278) [#2281](https://github.com/ng-bootstrap/ng-bootstrap/issues/2281)



<a name="1.1.0"></a>
# [1.1.0](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.4...1.1.0) (2018-03-30)


### Bug Fixes

* **accordion:** don't crash for panels with no content ([da96dec](https://github.com/ng-bootstrap/ng-bootstrap/commit/da96dec)), closes [#2250](https://github.com/ng-bootstrap/ng-bootstrap/issues/2250) [#2251](https://github.com/ng-bootstrap/ng-bootstrap/issues/2251)
* **pagination:** emit page change only when collection size is set ([51a2a29](https://github.com/ng-bootstrap/ng-bootstrap/commit/51a2a29)), closes [#1841](https://github.com/ng-bootstrap/ng-bootstrap/issues/1841) [#2257](https://github.com/ng-bootstrap/ng-bootstrap/issues/2257)
* **tabset:** don't crash for tabs with no content ([3b3c979](https://github.com/ng-bootstrap/ng-bootstrap/commit/3b3c979)), closes [#2252](https://github.com/ng-bootstrap/ng-bootstrap/issues/2252)


### Features

* **datepicker:** ability to prevent popup from closing automatically ([7201af3](https://github.com/ng-bootstrap/ng-bootstrap/commit/7201af3)), closes [#1984](https://github.com/ng-bootstrap/ng-bootstrap/issues/1984) [#2192](https://github.com/ng-bootstrap/ng-bootstrap/issues/2192)
* **datepicker:** add 'dateSelect' output for date selection listening ([acad88a](https://github.com/ng-bootstrap/ng-bootstrap/commit/acad88a)), closes [#2181](https://github.com/ng-bootstrap/ng-bootstrap/issues/2181) [#2254](https://github.com/ng-bootstrap/ng-bootstrap/issues/2254)
* **dropdown:** allow using any event to toggle dropdowns ([25e0d39](https://github.com/ng-bootstrap/ng-bootstrap/commit/25e0d39)), closes [#1115](https://github.com/ng-bootstrap/ng-bootstrap/issues/1115) [#1926](https://github.com/ng-bootstrap/ng-bootstrap/issues/1926) [#2082](https://github.com/ng-bootstrap/ng-bootstrap/issues/2082)
* **modal:** add 'backdropClass' option ([5ffaabc](https://github.com/ng-bootstrap/ng-bootstrap/commit/5ffaabc)), closes [#2166](https://github.com/ng-bootstrap/ng-bootstrap/issues/2166) [#2248](https://github.com/ng-bootstrap/ng-bootstrap/issues/2248)
* **modal:** add vertically centered option ([00e79c4](https://github.com/ng-bootstrap/ng-bootstrap/commit/00e79c4)), closes [#1124](https://github.com/ng-bootstrap/ng-bootstrap/issues/1124) [#2074](https://github.com/ng-bootstrap/ng-bootstrap/issues/2074)
* **popover:** introduce disabled flag ([234bab3](https://github.com/ng-bootstrap/ng-bootstrap/commit/234bab3)), closes [#2188](https://github.com/ng-bootstrap/ng-bootstrap/issues/2188) [#2229](https://github.com/ng-bootstrap/ng-bootstrap/issues/2229)
* **tooltip:** intoduce disabled flag ([e05a99f](https://github.com/ng-bootstrap/ng-bootstrap/commit/e05a99f)), closes [#2253](https://github.com/ng-bootstrap/ng-bootstrap/issues/2253)



<a name="1.0.4"></a>
## [1.0.4](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.3...1.0.4) (2018-03-23)

This release contains the same code as 1.0.3 but we need to push another version due to npm errors while publishing 1.0.3


<a name="1.0.3"></a>
## [1.0.3](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.2...1.0.3) (2018-03-23)


### Bug Fixes

* **accordion:** properly determine titles when using nested accordions ([171a70d](https://github.com/ng-bootstrap/ng-bootstrap/commit/171a70d)), closes [#2240](https://github.com/ng-bootstrap/ng-bootstrap/issues/2240) [#2247](https://github.com/ng-bootstrap/ng-bootstrap/issues/2247)
* **tabset:** properly determine titles when using nested tabsets ([4a2f65a](https://github.com/ng-bootstrap/ng-bootstrap/commit/4a2f65a)), closes [#2249](https://github.com/ng-bootstrap/ng-bootstrap/issues/2249)



<a name="1.0.2"></a>
## [1.0.2](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.1...1.0.2) (2018-03-19)


### Bug Fixes

* **accordion:** restore 'type' input behaviour for styling panels ([9b62d75](https://github.com/ng-bootstrap/ng-bootstrap/commit/9b62d75)), closes [#1897](https://github.com/ng-bootstrap/ng-bootstrap/issues/1897) [#2227](https://github.com/ng-bootstrap/ng-bootstrap/issues/2227)
* **datepicker:** add class "show" to visible datepicker dropdown ([6938e4b](https://github.com/ng-bootstrap/ng-bootstrap/commit/6938e4b)), closes [#2088](https://github.com/ng-bootstrap/ng-bootstrap/issues/2088) [#2013](https://github.com/ng-bootstrap/ng-bootstrap/issues/2013)
* **datepicker:** optional min/max dates for infinite navigation ([3a1a341](https://github.com/ng-bootstrap/ng-bootstrap/commit/3a1a341)), closes [#1732](https://github.com/ng-bootstrap/ng-bootstrap/issues/1732) [#2219](https://github.com/ng-bootstrap/ng-bootstrap/issues/2219)
* **demo:** avoid removing DOM elements in decimal rating demo ([40a8281](https://github.com/ng-bootstrap/ng-bootstrap/commit/40a8281)), closes [#2178](https://github.com/ng-bootstrap/ng-bootstrap/issues/2178) [#2225](https://github.com/ng-bootstrap/ng-bootstrap/issues/2225)
* **modal:** don't use inline styles ([5f14b4e](https://github.com/ng-bootstrap/ng-bootstrap/commit/5f14b4e)), closes [#2085](https://github.com/ng-bootstrap/ng-bootstrap/issues/2085) [#2223](https://github.com/ng-bootstrap/ng-bootstrap/issues/2223)
* **typeahead:** fix SSR (universal) rendering ([2c5a354](https://github.com/ng-bootstrap/ng-bootstrap/commit/2c5a354)), closes [#2190](https://github.com/ng-bootstrap/ng-bootstrap/issues/2190) [#2139](https://github.com/ng-bootstrap/ng-bootstrap/issues/2139) [#2224](https://github.com/ng-bootstrap/ng-bootstrap/issues/2224)


<a name="1.0.1"></a>
## [1.0.1](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0...1.0.1) (2018-03-09)


### Bug Fixes

* **modal:** support server rendering with lazy loading ([02f6f7a](https://github.com/ng-bootstrap/ng-bootstrap/commit/02f6f7a)), closes [#1968](https://github.com/ng-bootstrap/ng-bootstrap/issues/1968) [#2180](https://github.com/ng-bootstrap/ng-bootstrap/issues/2180)
* **timepicker:** Add CSS for IE10 flexbox ([7c0d6d7](https://github.com/ng-bootstrap/ng-bootstrap/commit/7c0d6d7)), closes [#2163](https://github.com/ng-bootstrap/ng-bootstrap/issues/2163) [#2167](https://github.com/ng-bootstrap/ng-bootstrap/issues/2167)
* **tooltip:** unregister event listener functions only if present ([b9ad060](https://github.com/ng-bootstrap/ng-bootstrap/commit/b9ad060)), closes [#2199](https://github.com/ng-bootstrap/ng-bootstrap/issues/2199) [#2205](https://github.com/ng-bootstrap/ng-bootstrap/issues/2205)
* **typeahead:** don't show hint if there is no active option ([5d20d1f](https://github.com/ng-bootstrap/ng-bootstrap/commit/5d20d1f)), closes [#2185](https://github.com/ng-bootstrap/ng-bootstrap/issues/2185) [#2198](https://github.com/ng-bootstrap/ng-bootstrap/issues/2198)



<a name="1.0.0"></a>
# [1.0.0](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-beta.9...1.0.0) (2018-01-26)

This is the first, stable release of ng-bootstrap!

### Bug Fixes

* **datepicker:** disable back navigation arrow ([384b2e8](https://github.com/ng-bootstrap/ng-bootstrap/commit/384b2e8)), closes [#2093](https://github.com/ng-bootstrap/ng-bootstrap/issues/2093) [#2110](https://github.com/ng-bootstrap/ng-bootstrap/issues/2110)
* **datepicker:** fix datepicker display in IE10 ([1cfaef0](https://github.com/ng-bootstrap/ng-bootstrap/commit/1cfaef0)), closes [#2094](https://github.com/ng-bootstrap/ng-bootstrap/issues/2094) [#2121](https://github.com/ng-bootstrap/ng-bootstrap/issues/2121)


<a name="1.0.0-beta.9"></a>
# [1.0.0-beta.9](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-beta.8...1.0.0-beta.9) (2018-01-05)

This release bumps up minimal Bootstrap CSS dependency to 4.0.0-beta.3. 


### Bug Fixes

* **tooltip:** fix arrow positioning in Bootstrap beta.3 ([de56f10](https://github.com/ng-bootstrap/ng-bootstrap/commit/de56f10)), closes [#2067](https://github.com/ng-bootstrap/ng-bootstrap/issues/2067)



<a name="1.0.0-beta.8"></a>
# [1.0.0-beta.8](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-beta.7...1.0.0-beta.8) (2017-12-15)


### Bug Fixes

* **carousel:** use only public methods in template ([da31c3e](https://github.com/ng-bootstrap/ng-bootstrap/commit/da31c3e)), closes [#2038](https://github.com/ng-bootstrap/ng-bootstrap/issues/2038) [#2040](https://github.com/ng-bootstrap/ng-bootstrap/issues/2040)
* **datepicker:** support `NgbDateAdapter` in `NgbInputDatepicker` ([0e325ca](https://github.com/ng-bootstrap/ng-bootstrap/commit/0e325ca)), closes [#2002](https://github.com/ng-bootstrap/ng-bootstrap/issues/2002) [#2003](https://github.com/ng-bootstrap/ng-bootstrap/issues/2003)
* **pagination:** remove internal annotation ([f1137aa](https://github.com/ng-bootstrap/ng-bootstrap/commit/f1137aa)), closes [#2038](https://github.com/ng-bootstrap/ng-bootstrap/issues/2038) [#2041](https://github.com/ng-bootstrap/ng-bootstrap/issues/2041)
* **positioning:** fix positioning with the width constraint ([0df398c](https://github.com/ng-bootstrap/ng-bootstrap/commit/0df398c)), closes [#1876](https://github.com/ng-bootstrap/ng-bootstrap/issues/1876) [#1902](https://github.com/ng-bootstrap/ng-bootstrap/issues/1902)


### Features

* **datepicker:** simplify css handling of the navigation system ([9a27911](https://github.com/ng-bootstrap/ng-bootstrap/commit/9a27911)), closes [#1614](https://github.com/ng-bootstrap/ng-bootstrap/issues/1614)
* **typeahead:** allow search on focus and click ([96d073d](https://github.com/ng-bootstrap/ng-bootstrap/commit/96d073d)), closes [#698](https://github.com/ng-bootstrap/ng-bootstrap/issues/698) [#1990](https://github.com/ng-bootstrap/ng-bootstrap/issues/1990)



<a name="1.0.0-beta.7"></a>
# [1.0.0-beta.7](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-beta.6...1.0.0-beta.7) (2017-12-08)


This release bumps up minimal Angular dependency to 5.0.2. 


<a name="1.0.0-beta.6"></a>
# [1.0.0-beta.6](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-beta.5...1.0.0-beta.6) (2017-12-01)

This release depends on Bootstrap beta.2 CSS.

### Bug Fixes

* **accordion:** hide panel when destroyOnHide set to false ([9e2df7f](https://github.com/ng-bootstrap/ng-bootstrap/commit/9e2df7f)), closes [#1915](https://github.com/ng-bootstrap/ng-bootstrap/issues/1915)
* **buttons:** mark the form control of a ngbRadioGroup as touched ([9dde9c2](https://github.com/ng-bootstrap/ng-bootstrap/commit/9dde9c2)), closes [#1987](https://github.com/ng-bootstrap/ng-bootstrap/issues/1987) [#1988](https://github.com/ng-bootstrap/ng-bootstrap/issues/1988)
* **datepicker:** close date picker after selecting the same date ([ea796de](https://github.com/ng-bootstrap/ng-bootstrap/commit/ea796de)), closes [#1783](https://github.com/ng-bootstrap/ng-bootstrap/issues/1783)
* **datepicker:** date selection regression for non-visible dates ([8e0ddb4](https://github.com/ng-bootstrap/ng-bootstrap/commit/8e0ddb4)), closes [#1974](https://github.com/ng-bootstrap/ng-bootstrap/issues/1974)
* **datepicker:** popup disabled state ([a05727e](https://github.com/ng-bootstrap/ng-bootstrap/commit/a05727e))
* **datepicker:** remove border from 'btn-link' style ([c6121b3](https://github.com/ng-bootstrap/ng-bootstrap/commit/c6121b3)), closes [#1900](https://github.com/ng-bootstrap/ng-bootstrap/issues/1900) [#1851](https://github.com/ng-bootstrap/ng-bootstrap/issues/1851)
* **datepicker:** use class btn with btn-link ([3648f46](https://github.com/ng-bootstrap/ng-bootstrap/commit/3648f46))
* **dropdown:** add "dropdown" class for placements other than "top" ([ed88f72](https://github.com/ng-bootstrap/ng-bootstrap/commit/ed88f72)), closes [#1847](https://github.com/ng-bootstrap/ng-bootstrap/issues/1847) [#1852](https://github.com/ng-bootstrap/ng-bootstrap/issues/1852)
* **dropdown:** adjust for better compatibility with universal ([9ad8f43](https://github.com/ng-bootstrap/ng-bootstrap/commit/9ad8f43)), closes [#1883](https://github.com/ng-bootstrap/ng-bootstrap/issues/1883)
* **popover:** added margin to arrow placement ([2506ae4](https://github.com/ng-bootstrap/ng-bootstrap/commit/2506ae4)), closes [#1845](https://github.com/ng-bootstrap/ng-bootstrap/issues/1845) [#1855](https://github.com/ng-bootstrap/ng-bootstrap/issues/1855)
* **timepicker:** remove border from 'btn-link' style ([3f9b909](https://github.com/ng-bootstrap/ng-bootstrap/commit/3f9b909)), closes [#1851](https://github.com/ng-bootstrap/ng-bootstrap/issues/1851) [#1901](https://github.com/ng-bootstrap/ng-bootstrap/issues/1901)
* **timepicker:** use class btn with btn-link ([e6a93e0](https://github.com/ng-bootstrap/ng-bootstrap/commit/e6a93e0))
* **typeahead:** don't close dropdown on typeahead input click ([fa9c080](https://github.com/ng-bootstrap/ng-bootstrap/commit/fa9c080)), closes [#1853](https://github.com/ng-bootstrap/ng-bootstrap/issues/1853) [#1989](https://github.com/ng-bootstrap/ng-bootstrap/issues/1989)


### Features

* **datepicker:** add Islamic Umalqura calendar ([22a7210](https://github.com/ng-bootstrap/ng-bootstrap/commit/22a7210))
* **datepicker:** add support for the container option ([6c7a31b](https://github.com/ng-bootstrap/ng-bootstrap/commit/6c7a31b)), closes [#1380](https://github.com/ng-bootstrap/ng-bootstrap/issues/1380) [#1857](https://github.com/ng-bootstrap/ng-bootstrap/issues/1857)
* **datepicker:** allow user to define his own date structure ([a406e52](https://github.com/ng-bootstrap/ng-bootstrap/commit/a406e52)), closes [#1753](https://github.com/ng-bootstrap/ng-bootstrap/issues/1753)
* **progressbar:** allow changing progressbar height ([b329be9](https://github.com/ng-bootstrap/ng-bootstrap/commit/b329be9)), closes [#1904](https://github.com/ng-bootstrap/ng-bootstrap/issues/1904) [#1908](https://github.com/ng-bootstrap/ng-bootstrap/issues/1908)
* **rating:** add 'index' variable in template ([2ed3632](https://github.com/ng-bootstrap/ng-bootstrap/commit/2ed3632)), closes [#1922](https://github.com/ng-bootstrap/ng-bootstrap/issues/1922) [#1931](https://github.com/ng-bootstrap/ng-bootstrap/issues/1931)
* **typeahead:** add exportAs property for ngbTypeahead ([c318045](https://github.com/ng-bootstrap/ng-bootstrap/commit/c318045)), closes [#1559](https://github.com/ng-bootstrap/ng-bootstrap/issues/1559)



<a name="1.0.0-beta.5"></a>
# [1.0.0-beta.5](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-beta.4...1.0.0-beta.5) (2017-09-14)


### Bug Fixes

* **modal:** remove unnecessary Injectable annotation ([0bf798d](https://github.com/ng-bootstrap/ng-bootstrap/commit/0bf798d)), closes [#1832](https://github.com/ng-bootstrap/ng-bootstrap/issues/1832) [#1833](https://github.com/ng-bootstrap/ng-bootstrap/issues/1833)



<a name="1.0.0-beta.4"></a>
# [1.0.0-beta.4](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-beta.3...1.0.0-beta.4) (2017-09-07)

Lot's of positioning updates in this release. Now you can use more positioning options and auto-positioning for
all widgets that open popups.

### Bug Fixes

* **positioning:** check for secondary available placements ([0f92c80](https://github.com/ng-bootstrap/ng-bootstrap/commit/0f92c80)), closes [#1819](https://github.com/ng-bootstrap/ng-bootstrap/issues/1819)


### Features

* add support for "auto" placement and multi-placement ([b73023a](https://github.com/ng-bootstrap/ng-bootstrap/commit/b73023a)), closes [#992](https://github.com/ng-bootstrap/ng-bootstrap/issues/992) [#1782](https://github.com/ng-bootstrap/ng-bootstrap/issues/1782)
* support more positioning options for tooltips and popovers ([4f1e518](https://github.com/ng-bootstrap/ng-bootstrap/commit/4f1e518)), closes [#857](https://github.com/ng-bootstrap/ng-bootstrap/issues/857) [#1772](https://github.com/ng-bootstrap/ng-bootstrap/issues/1772)
* **datepicker:** add support for placement "auto" ([d8bee8e](https://github.com/ng-bootstrap/ng-bootstrap/commit/d8bee8e)), closes [#1257](https://github.com/ng-bootstrap/ng-bootstrap/issues/1257) [#1820](https://github.com/ng-bootstrap/ng-bootstrap/issues/1820)
* **dropdown:** auto and array support in placement ([6123780](https://github.com/ng-bootstrap/ng-bootstrap/commit/6123780)), closes [#1171](https://github.com/ng-bootstrap/ng-bootstrap/issues/1171) [#1814](https://github.com/ng-bootstrap/ng-bootstrap/issues/1814)
* **modal:** add 'beforeDismiss' option ([a758eae](https://github.com/ng-bootstrap/ng-bootstrap/commit/a758eae)), closes [#1598](https://github.com/ng-bootstrap/ng-bootstrap/issues/1598) [#1799](https://github.com/ng-bootstrap/ng-bootstrap/issues/1799)
* **typeahead:** added support for placement ([a053819](https://github.com/ng-bootstrap/ng-bootstrap/commit/a053819)), closes [#1767](https://github.com/ng-bootstrap/ng-bootstrap/issues/1767) [#1821](https://github.com/ng-bootstrap/ng-bootstrap/issues/1821)



<a name="1.0.0-beta.3"></a>
# [1.0.0-beta.3](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-beta.2...1.0.0-beta.3) (2017-08-30)


### Bug Fixes

* restore compatibility with Angular 5.x ([f92f1e5](https://github.com/ng-bootstrap/ng-bootstrap/commit/f92f1e5)), closes [#1791](https://github.com/ng-bootstrap/ng-bootstrap/issues/1791) [#1792](https://github.com/ng-bootstrap/ng-bootstrap/issues/1792)



<a name="1.0.0-beta.2"></a>
# [1.0.0-beta.2](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-beta.1...1.0.0-beta.2) (2017-08-23)


### Bug Fixes

* **accordion:** allign with Bootstrap 4.beta markup ([e32fb24](https://github.com/ng-bootstrap/ng-bootstrap/commit/e32fb24)), closes [#1050](https://github.com/ng-bootstrap/ng-bootstrap/issues/1050) [#1332](https://github.com/ng-bootstrap/ng-bootstrap/issues/1332)
* **dropdown:** correct TS typings ([9447f5d](https://github.com/ng-bootstrap/ng-bootstrap/commit/9447f5d)), closes [#1754](https://github.com/ng-bootstrap/ng-bootstrap/issues/1754)
* **dropdown:** restore support for dropups ([c7a16a5](https://github.com/ng-bootstrap/ng-bootstrap/commit/c7a16a5)), closes [#1747](https://github.com/ng-bootstrap/ng-bootstrap/issues/1747) [#1752](https://github.com/ng-bootstrap/ng-bootstrap/issues/1752)


### Features

* **accordion:** support nodes preservation ([f6cf01b](https://github.com/ng-bootstrap/ng-bootstrap/commit/f6cf01b)), closes [#1370](https://github.com/ng-bootstrap/ng-bootstrap/issues/1370)
* **tabset:** add nav justification and orientation ([73ba757](https://github.com/ng-bootstrap/ng-bootstrap/commit/73ba757)), closes [#1472](https://github.com/ng-bootstrap/ng-bootstrap/issues/1472) [#1239](https://github.com/ng-bootstrap/ng-bootstrap/issues/1239)


### BREAKING CHANGES

* **dropdown:** The `up` input is no longer supported by you can use more flexible
`placement` setting now.

Before:

```html
<div ngbDropdown [up]="true">
```

After:

```html
<div ngbDropdown placement="top-right">
```



<a name="1.0.0-beta.1"></a>
# [1.0.0-beta.1](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.31...1.0.0-beta.1) (2017-08-11)

ng-bootstrap goes BETA (and requires Bootstrap CSS 4.0.0-beta now)!

### Bug Fixes

* **dropdown:** update for Bootstrap4.beta ([877c696](https://github.com/ng-bootstrap/ng-bootstrap/commit/877c696)), closes [#1745](https://github.com/ng-bootstrap/ng-bootstrap/issues/1745)
* **popover:** account for margins when positioning popovers ([5a7df43](https://github.com/ng-bootstrap/ng-bootstrap/commit/5a7df43))


### Features

* **buttons:** allow vertical radio buttons ([a38257d](https://github.com/ng-bootstrap/ng-bootstrap/commit/a38257d)), closes [#1231](https://github.com/ng-bootstrap/ng-bootstrap/issues/1231) [#1238](https://github.com/ng-bootstrap/ng-bootstrap/issues/1238) [#1733](https://github.com/ng-bootstrap/ng-bootstrap/issues/1733)
* **dropdown:** distinguish inside and outside clicks for autoClose ([bb975af](https://github.com/ng-bootstrap/ng-bootstrap/commit/bb975af)), closes [#1022](https://github.com/ng-bootstrap/ng-bootstrap/issues/1022)


### BREAKING CHANGES

* ng-bootstrap now requires Bootstrap CSS 4.0.0-beta
* **buttons:** The `btn-group` CSS class needs to added explicitly for radio buttons.

Before:

```
<div ngbRadioGroup ...>
  ...
</div>
```

After:

```
<div class="btn-group" ngbRadioGroup ...>
  ...
</div>
```
* **dropdown:** Dropdown menu now requires usage of the new `ngbDropdownMenu` directive.

Before:

```html
<div ngbDropdown>
  <button ngbDropdownToggle>Toggle dropdown</button>
  <div class="dropdown-menu">
    <a class="dropdown-item">Action</a>
  </div>
</div>
```

After (notice **ngbDropdownMenu**):

```html
<div ngbDropdown>
  <button ngbDropdownToggle>Toggle dropdown</button>
  <div ngbDropdownMenu>
    <a class="dropdown-item">Action</a>
  </div>
</div>
```



<a name="1.0.0-alpha.31"></a>
# [1.0.0-alpha.31](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.30...1.0.0-alpha.31) (2017-08-11)

This is the last alpha release of ng-bootstrap. Next stop - beta!

### Bug Fixes

* **typeahead:** resubscribe for value changes on blur, esc, enter ([47797d3](https://github.com/ng-bootstrap/ng-bootstrap/commit/47797d3)), closes [#723](https://github.com/ng-bootstrap/ng-bootstrap/issues/723) [#1244](https://github.com/ng-bootstrap/ng-bootstrap/issues/1244)


### Features

* **typeahead:** add support for the 'container' input ([bc3fd61](https://github.com/ng-bootstrap/ng-bootstrap/commit/bc3fd61)), closes [#1105](https://github.com/ng-bootstrap/ng-bootstrap/issues/1105) [#1731](https://github.com/ng-bootstrap/ng-bootstrap/issues/1731)



<a name="1.0.0-alpha.30"></a>
# [1.0.0-alpha.30](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.29...1.0.0-alpha.30) (2017-08-03)


### Bug Fixes

* **buttons:** set name on radio inputs to fix keyboard navigation ([3bfd82d](https://github.com/ng-bootstrap/ng-bootstrap/commit/3bfd82d)), closes [#1704](https://github.com/ng-bootstrap/ng-bootstrap/issues/1704) [#1706](https://github.com/ng-bootstrap/ng-bootstrap/issues/1706)
* **carousel:** restart timer when interval changed ([ae4e3e9](https://github.com/ng-bootstrap/ng-bootstrap/commit/ae4e3e9)), closes [#1690](https://github.com/ng-bootstrap/ng-bootstrap/issues/1690) [#1702](https://github.com/ng-bootstrap/ng-bootstrap/issues/1702)
* **datepicker:** focus datepicker after opening it inside the popup ([0dbe0cb](https://github.com/ng-bootstrap/ng-bootstrap/commit/0dbe0cb)), closes [#1708](https://github.com/ng-bootstrap/ng-bootstrap/issues/1708) [#1717](https://github.com/ng-bootstrap/ng-bootstrap/issues/1717)
* **datepicker:** propagate model and validation state on 'input' event ([38b8ffa](https://github.com/ng-bootstrap/ng-bootstrap/commit/38b8ffa)), closes [#1225](https://github.com/ng-bootstrap/ng-bootstrap/issues/1225) [#1605](https://github.com/ng-bootstrap/ng-bootstrap/issues/1605)
* **datepicker:** retain manually entered values even if invalid ([4bd81c3](https://github.com/ng-bootstrap/ng-bootstrap/commit/4bd81c3)), closes [#1710](https://github.com/ng-bootstrap/ng-bootstrap/issues/1710) [#1725](https://github.com/ng-bootstrap/ng-bootstrap/issues/1725)


### Features

* **modal:** add injector option ([0829b30](https://github.com/ng-bootstrap/ng-bootstrap/commit/0829b30)), closes [#1686](https://github.com/ng-bootstrap/ng-bootstrap/issues/1686) [#1685](https://github.com/ng-bootstrap/ng-bootstrap/issues/1685)



<a name="1.0.0-alpha.29"></a>
# [1.0.0-alpha.29](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.28...1.0.0-alpha.29) (2017-07-25)


### Bug Fixes

* **buttons:** make buttons selectors more specific ([f9bc76e](https://github.com/ng-bootstrap/ng-bootstrap/commit/f9bc76e)), closes [#1125](https://github.com/ng-bootstrap/ng-bootstrap/issues/1125) [#1678](https://github.com/ng-bootstrap/ng-bootstrap/issues/1678)
* **modal:** don't try to focus non-focusable elements ([0c03671](https://github.com/ng-bootstrap/ng-bootstrap/commit/0c03671)), closes [#1627](https://github.com/ng-bootstrap/ng-bootstrap/issues/1627) [#1691](https://github.com/ng-bootstrap/ng-bootstrap/issues/1691)
* **timepicker:** account for CD before model write (meridian case) ([ffd86bc](https://github.com/ng-bootstrap/ng-bootstrap/commit/ffd86bc)), closes [#1696](https://github.com/ng-bootstrap/ng-bootstrap/issues/1696) [#1699](https://github.com/ng-bootstrap/ng-bootstrap/issues/1699)
* **timepicker:** switch to PM when hour > 12 ([5cbb429](https://github.com/ng-bootstrap/ng-bootstrap/commit/5cbb429)), closes [#1680](https://github.com/ng-bootstrap/ng-bootstrap/issues/1680) [#1684](https://github.com/ng-bootstrap/ng-bootstrap/issues/1684)


### Features

* **buttons:** add support for checkbox buttons ([b433e7b](https://github.com/ng-bootstrap/ng-bootstrap/commit/b433e7b)), closes [#890](https://github.com/ng-bootstrap/ng-bootstrap/issues/890) [#1688](https://github.com/ng-bootstrap/ng-bootstrap/issues/1688)


### BREAKING CHANGES

* **buttons:** The `NgbButtonsModule` changed location (path) and content. This path
might need adjusting for people importing individual modules.
Before: `import {NgbButtonsModule} from './buttons/radio.module'`
After:  `import {NgbButtonsModule} from './buttons/buttons.module'`

The `NgbButtonsModule` now contains both checkbox and radio buttons.
* **buttons:** Selectors for radio buttons related directives were changed and now both label
and input require ng-bootstrap specific attributes as selectors.

Before:

```
<div [(ngModel)]="model" ngbRadioGroup>
  <label class="btn">
    <input type="radio" name="radio" [value]="values[0]"/> {{ values[0] }}
  </label>
  <label class="btn">
    <input type="radio" name="radio" [value]="values[1]"/> {{ values[1] }}
  </label>
</div>
```

After:

```
<div [(ngModel)]="model" ngbRadioGroup>
  <label ngbButtonLabel>
    <input ngbButton type="radio" name="radio" [value]="values[0]"/> {{ values[0] }}
  </label>
  <label ngbButtonLabel>
    <input ngbButton type="radio" name="radio" [value]="values[1]"/> {{ values[1] }}
  </label>
</div>
```

Notice new `ngbButtonLabel` and `ngbButton` attributes that act as new selectors.



<a name="1.0.0-alpha.28"></a>
# [1.0.0-alpha.28](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.27...1.0.0-alpha.28) (2017-07-11)


### Bug Fixes

* **datepicker:** use noon instead of midnight for date conversion ([2fdd8f1](https://github.com/ng-bootstrap/ng-bootstrap/commit/2fdd8f1)), closes [#1615](https://github.com/ng-bootstrap/ng-bootstrap/issues/1615) [#1676](https://github.com/ng-bootstrap/ng-bootstrap/issues/1676)
* **timepicker:** respect meridian setting when entring hours ([62c5ae3](https://github.com/ng-bootstrap/ng-bootstrap/commit/62c5ae3)), closes [#1631](https://github.com/ng-bootstrap/ng-bootstrap/issues/1631) [#1636](https://github.com/ng-bootstrap/ng-bootstrap/issues/1636)
* **typeahead:** avoid unnecessary re-creation of DOM nodes ([0c19153](https://github.com/ng-bootstrap/ng-bootstrap/commit/0c19153)), closes [#1659](https://github.com/ng-bootstrap/ng-bootstrap/issues/1659) [#1674](https://github.com/ng-bootstrap/ng-bootstrap/issues/1674)


### Features

* **datepicker:** add keyboard navigation ([bd94215](https://github.com/ng-bootstrap/ng-bootstrap/commit/bd94215))


### BREAKING CHANGES

* **datepicker:** component uses `ChangeDetectionStrategy.OnPush` now for most of the internal implementation.
Things like the dynamic internationalization or calendar change might not work anymore as these are injected services. Any internal changes in these services in runtime will not trigger datepicker re-rendering.



<a name="1.0.0-alpha.27"></a>
# [1.0.0-alpha.27](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.26...1.0.0-alpha.27) (2017-06-30)


### Bug Fixes

* support closure-compiler in the library ([5cfd9e4](https://github.com/ng-bootstrap/ng-bootstrap/commit/5cfd9e4))
* **datepicker:** consider empty string inputs as valid ([95d1668](https://github.com/ng-bootstrap/ng-bootstrap/commit/95d1668)), closes [#1588](https://github.com/ng-bootstrap/ng-bootstrap/issues/1588) [#1637](https://github.com/ng-bootstrap/ng-bootstrap/issues/1637)
* **popover:** popover not positioned properly ([85fadb8](https://github.com/ng-bootstrap/ng-bootstrap/commit/85fadb8)), closes [#1649](https://github.com/ng-bootstrap/ng-bootstrap/issues/1649)
* **positioning:** top-right, right-bottom, bottom-right, left-bottom ([4689b4b](https://github.com/ng-bootstrap/ng-bootstrap/commit/4689b4b)), closes [#1561](https://github.com/ng-bootstrap/ng-bootstrap/issues/1561)
* **tooltip:** properly position tooltips close to container edges ([4a221c1](https://github.com/ng-bootstrap/ng-bootstrap/commit/4a221c1)), closes [#1263](https://github.com/ng-bootstrap/ng-bootstrap/issues/1263) [#1371](https://github.com/ng-bootstrap/ng-bootstrap/issues/1371) [#1643](https://github.com/ng-bootstrap/ng-bootstrap/issues/1643)


### Features

* **carousel:** add event on carousel slide with direction info ([5d79c00](https://github.com/ng-bootstrap/ng-bootstrap/commit/5d79c00)), closes [#1356](https://github.com/ng-bootstrap/ng-bootstrap/issues/1356) [#1406](https://github.com/ng-bootstrap/ng-bootstrap/issues/1406)
* **datepicker:** allow positioning of datepicker popup ([3e22a63](https://github.com/ng-bootstrap/ng-bootstrap/commit/3e22a63)), closes [#1082](https://github.com/ng-bootstrap/ng-bootstrap/issues/1082) [#1570](https://github.com/ng-bootstrap/ng-bootstrap/issues/1570)
* **typeahead:** export the NgbHighlight component ([a89cc97](https://github.com/ng-bootstrap/ng-bootstrap/commit/a89cc97)), closes [#1553](https://github.com/ng-bootstrap/ng-bootstrap/issues/1553) [#1555](https://github.com/ng-bootstrap/ng-bootstrap/issues/1555)



<a name="1.0.0-alpha.26"></a>
# [1.0.0-alpha.26](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.25...1.0.0-alpha.26) (2017-05-16)


### Bug Fixes

* **datepicker:** prevent memory leak caused by ngZone subscription ([c0c093b](https://github.com/ng-bootstrap/ng-bootstrap/commit/c0c093b)), closes [#1534](https://github.com/ng-bootstrap/ng-bootstrap/issues/1534)
* **rating:** properly propagate control's touched state ([53aa678](https://github.com/ng-bootstrap/ng-bootstrap/commit/53aa678)), closes [#1514](https://github.com/ng-bootstrap/ng-bootstrap/issues/1514) [#1532](https://github.com/ng-bootstrap/ng-bootstrap/issues/1532)


### Features

* **rating:** allow set rating to 0 on click ([e3100e5](https://github.com/ng-bootstrap/ng-bootstrap/commit/e3100e5)), closes [#1284](https://github.com/ng-bootstrap/ng-bootstrap/issues/1284) [#1515](https://github.com/ng-bootstrap/ng-bootstrap/issues/1515)



<a name="1.0.0-alpha.25"></a>
# [1.0.0-alpha.25](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.24...1.0.0-alpha.25) (2017-04-25)


### Features

* bump up Angular dependency to 4.0.3 ([26bc8df](https://github.com/ng-bootstrap/ng-bootstrap/commit/26bc8df)), closes [#1337](https://github.com/ng-bootstrap/ng-bootstrap/issues/1337) [#1415](https://github.com/ng-bootstrap/ng-bootstrap/issues/1415) [#1433](https://github.com/ng-bootstrap/ng-bootstrap/issues/1433) [#1439](https://github.com/ng-bootstrap/ng-bootstrap/issues/1439) [#1512](https://github.com/ng-bootstrap/ng-bootstrap/issues/1512)


### BREAKING CHANGES

* ng-bootstrap requires a minimal version of Angular 4.0.3



<a name="1.0.0-alpha.24"></a>
# [1.0.0-alpha.24](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.23...1.0.0-alpha.24) (2017-04-22)


### Bug Fixes

* **buttons:** add `role="group"` to radio group ([c847a92](https://github.com/ng-bootstrap/ng-bootstrap/commit/c847a92)), closes [#1503](https://github.com/ng-bootstrap/ng-bootstrap/issues/1503)
* **collapse:** remove aria-expanded from target ([a24b283](https://github.com/ng-bootstrap/ng-bootstrap/commit/a24b283)), closes [#1492](https://github.com/ng-bootstrap/ng-bootstrap/issues/1492)


### Features

* **rating:** set aria-disabled="true" when readonly ([c89f2c4](https://github.com/ng-bootstrap/ng-bootstrap/commit/c89f2c4)), closes [#1489](https://github.com/ng-bootstrap/ng-bootstrap/issues/1489)
* **timepicker:** replace table layout with flexbox ([b94a126](https://github.com/ng-bootstrap/ng-bootstrap/commit/b94a126)), closes [#1498](https://github.com/ng-bootstrap/ng-bootstrap/issues/1498)



<a name="1.0.0-alpha.23"></a>
# [1.0.0-alpha.23](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.22...1.0.0-alpha.23) (2017-04-12)


### Bug Fixes

* **accordion:** disabled links are announced and focusable ([e836798](https://github.com/ng-bootstrap/ng-bootstrap/commit/e836798)), closes [#1443](https://github.com/ng-bootstrap/ng-bootstrap/issues/1443)
* **accordion:** remove aria-controls when panel is not in DOM ([44acc44](https://github.com/ng-bootstrap/ng-bootstrap/commit/44acc44)), closes [#1482](https://github.com/ng-bootstrap/ng-bootstrap/issues/1482)
* **accordion:** remove unneded aria-selected ([92ae3fd](https://github.com/ng-bootstrap/ng-bootstrap/commit/92ae3fd)), closes [#1159](https://github.com/ng-bootstrap/ng-bootstrap/issues/1159) [#1438](https://github.com/ng-bootstrap/ng-bootstrap/issues/1438)
* **carousel:** remove inappropriate role="listbox" from carousel ([39e1df5](https://github.com/ng-bootstrap/ng-bootstrap/commit/39e1df5)), closes [#1484](https://github.com/ng-bootstrap/ng-bootstrap/issues/1484)
* **datepicker:** add stricter checks on dates validity ([184f45a](https://github.com/ng-bootstrap/ng-bootstrap/commit/184f45a)), closes [#1230](https://github.com/ng-bootstrap/ng-bootstrap/issues/1230) [#1442](https://github.com/ng-bootstrap/ng-bootstrap/issues/1442)
* **pagination:** remove duplicate accessibility labels ([4960533](https://github.com/ng-bootstrap/ng-bootstrap/commit/4960533)), closes [#1429](https://github.com/ng-bootstrap/ng-bootstrap/issues/1429)
* **rating:** correct aria attribute setting ([4575573](https://github.com/ng-bootstrap/ng-bootstrap/commit/4575573)), closes [#1479](https://github.com/ng-bootstrap/ng-bootstrap/issues/1479)
* **rating:** properly support disabled control state ([a29da45](https://github.com/ng-bootstrap/ng-bootstrap/commit/a29da45)), closes [#1432](https://github.com/ng-bootstrap/ng-bootstrap/issues/1432) [#1435](https://github.com/ng-bootstrap/ng-bootstrap/issues/1435)
* **tabs:** prevent focus of disabled tabs ([7d1dd97](https://github.com/ng-bootstrap/ng-bootstrap/commit/7d1dd97)), closes [#1430](https://github.com/ng-bootstrap/ng-bootstrap/issues/1430)
* **tabs:** remove aria-controls when content is destroyed ([a2a8a74](https://github.com/ng-bootstrap/ng-bootstrap/commit/a2a8a74)), closes [#1485](https://github.com/ng-bootstrap/ng-bootstrap/issues/1485)
* **tabset:** remove unneeded tabpanel role on container ([5005384](https://github.com/ng-bootstrap/ng-bootstrap/commit/5005384)), closes [#1409](https://github.com/ng-bootstrap/ng-bootstrap/issues/1409)
* **timepicker:** improve accessibility ([b2942d3](https://github.com/ng-bootstrap/ng-bootstrap/commit/b2942d3)), closes [#1480](https://github.com/ng-bootstrap/ng-bootstrap/issues/1480)
* **timepicker:** scale chevrons when size option is used ([493d0b3](https://github.com/ng-bootstrap/ng-bootstrap/commit/493d0b3)), closes [#1300](https://github.com/ng-bootstrap/ng-bootstrap/issues/1300) [#1405](https://github.com/ng-bootstrap/ng-bootstrap/issues/1405)
* **typeahead:** fix ARIA attributes ([ba4f48f](https://github.com/ng-bootstrap/ng-bootstrap/commit/ba4f48f)), closes [#1454](https://github.com/ng-bootstrap/ng-bootstrap/issues/1454) [#1454](https://github.com/ng-bootstrap/ng-bootstrap/issues/1454)


### Features

* **datepicker:** add validation ([4cbea99](https://github.com/ng-bootstrap/ng-bootstrap/commit/4cbea99)), closes [#1222](https://github.com/ng-bootstrap/ng-bootstrap/issues/1222) [#1434](https://github.com/ng-bootstrap/ng-bootstrap/issues/1434)
* **pagination:** improve accessibility ([424c38f](https://github.com/ng-bootstrap/ng-bootstrap/commit/424c38f)), closes [#1294](https://github.com/ng-bootstrap/ng-bootstrap/issues/1294)
* **popover:** add aria-describedby to popover triggering element ([92e4804](https://github.com/ng-bootstrap/ng-bootstrap/commit/92e4804)), closes [#1412](https://github.com/ng-bootstrap/ng-bootstrap/issues/1412)
* **tooltip:** add aria-describedby to tooltip triggering element ([0883635](https://github.com/ng-bootstrap/ng-bootstrap/commit/0883635)), closes [#1386](https://github.com/ng-bootstrap/ng-bootstrap/issues/1386)
* **typeahead:** add accessibility support ([e1fa7a4](https://github.com/ng-bootstrap/ng-bootstrap/commit/e1fa7a4)), closes [#1321](https://github.com/ng-bootstrap/ng-bootstrap/issues/1321)


### BREAKING CHANGES

* **datepicker:** Datepickers in popups are much stricter about valid dates
now and won't try to auto-correct invalid dates any more.
For example 2017-99-99 was considered valid previously and
auto-corrected. This is not the case any more. Please check
control's validity to detect invalid dates entered by users.
* **datepicker:** Invalid dates entered by a user into datepicker input are
propagated to the model as-is. This is required to properly
support validation and is in-line with behaviour of all the
built-in Angular validators. From now on you need to check
control's validity to determine if the entered date is valid
or not.



<a name="1.0.0-alpha.22"></a>
# [1.0.0-alpha.22](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.21...1.0.0-alpha.22) (2017-03-24)

This is a small release that contains peerDependencies adjustments needed to support Angular 4.x. This library 
was tested with the latest Angular and now fully supports both 4.x and 2.x.

### Bug Fixes

* **datepicker:** handle collapsed days/weeks properly ([4f54bfa](https://github.com/ng-bootstrap/ng-bootstrap/commit/4f54bfa)), closes [#1377](https://github.com/ng-bootstrap/ng-bootstrap/issues/1377) [#1383](https://github.com/ng-bootstrap/ng-bootstrap/issues/1383)



<a name="1.0.0-alpha.21"></a>
# [1.0.0-alpha.21](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.20...1.0.0-alpha.21) (2017-03-15)


### Bug Fixes

* **datepicker:** allow datepicker calendar override ([2792768](https://github.com/ng-bootstrap/ng-bootstrap/commit/2792768)), closes [#1366](https://github.com/ng-bootstrap/ng-bootstrap/issues/1366)
* **datepicker:** protect against invalid inputs ([eaf2de1](https://github.com/ng-bootstrap/ng-bootstrap/commit/eaf2de1)), closes [#1308](https://github.com/ng-bootstrap/ng-bootstrap/issues/1308) [#1364](https://github.com/ng-bootstrap/ng-bootstrap/issues/1364)
* **rating:** don't fire change event on init ([815cc20](https://github.com/ng-bootstrap/ng-bootstrap/commit/815cc20)), closes [#1282](https://github.com/ng-bootstrap/ng-bootstrap/issues/1282) [#1306](https://github.com/ng-bootstrap/ng-bootstrap/issues/1306) [#1357](https://github.com/ng-bootstrap/ng-bootstrap/issues/1357)


### Features

* **datepicker:** initial version of Hijri calendar ([1cf0c02](https://github.com/ng-bootstrap/ng-bootstrap/commit/1cf0c02))
* **model:** introduce the 'container' option ([743db91](https://github.com/ng-bootstrap/ng-bootstrap/commit/743db91)), closes [#1018](https://github.com/ng-bootstrap/ng-bootstrap/issues/1018) [#1264](https://github.com/ng-bootstrap/ng-bootstrap/issues/1264) [#1373](https://github.com/ng-bootstrap/ng-bootstrap/issues/1373)
* **tabset:** improve accessibility ([d7722ad](https://github.com/ng-bootstrap/ng-bootstrap/commit/d7722ad)), closes [#1327](https://github.com/ng-bootstrap/ng-bootstrap/issues/1327)
* **tabset:** support nodes preservation ([79dd101](https://github.com/ng-bootstrap/ng-bootstrap/commit/79dd101)), closes [#1161](https://github.com/ng-bootstrap/ng-bootstrap/issues/1161) [#1369](https://github.com/ng-bootstrap/ng-bootstrap/issues/1369)


### BREAKING CHANGES

* model: The `ngbModalContainer` directive is no longer needed and was
removed from this project. Just remove any references to the
`<template ngbModalContainer></template>` from your projects.



<a name="1.0.0-alpha.20"></a>
# [1.0.0-alpha.20](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.19...1.0.0-alpha.20) (2017-02-02)


### Bug Fixes

* **alert:** add missing alert-dismissible CSS class ([e2691b9](https://github.com/ng-bootstrap/ng-bootstrap/commit/e2691b9)), closes [#1267](https://github.com/ng-bootstrap/ng-bootstrap/issues/1267) [#1270](https://github.com/ng-bootstrap/ng-bootstrap/issues/1270)
* **datepicker:** mark dates without a day as invalid ([c57f913](https://github.com/ng-bootstrap/ng-bootstrap/commit/c57f913)), closes [#1278](https://github.com/ng-bootstrap/ng-bootstrap/issues/1278) [#1279](https://github.com/ng-bootstrap/ng-bootstrap/issues/1279)
* **datepicker:** navigation arrows not responding on Firefox when navigation=="arrows" ([e2410f9](https://github.com/ng-bootstrap/ng-bootstrap/commit/e2410f9)), closes [#1254](https://github.com/ng-bootstrap/ng-bootstrap/issues/1254)
* **timepicker:** correct input alligements ([9649ab2](https://github.com/ng-bootstrap/ng-bootstrap/commit/9649ab2)), closes [#1280](https://github.com/ng-bootstrap/ng-bootstrap/issues/1280)
* **typeahead:** don't modify Observable prototype ([ae6abb7](https://github.com/ng-bootstrap/ng-bootstrap/commit/ae6abb7)), closes [#1242](https://github.com/ng-bootstrap/ng-bootstrap/issues/1242) [#1256](https://github.com/ng-bootstrap/ng-bootstrap/issues/1256)


### Features

* **progressbar:** add possibility to specify progressbars content ([8e03090](https://github.com/ng-bootstrap/ng-bootstrap/commit/8e03090)), closes [#1251](https://github.com/ng-bootstrap/ng-bootstrap/issues/1251) [#1259](https://github.com/ng-bootstrap/ng-bootstrap/issues/1259)
* **progressbar:** show current value of progressbar ([83e01de](https://github.com/ng-bootstrap/ng-bootstrap/commit/83e01de)), closes [#1251](https://github.com/ng-bootstrap/ng-bootstrap/issues/1251) [#1269](https://github.com/ng-bootstrap/ng-bootstrap/issues/1269)
* **timepicker:** add input and meridian button sizing ([89c1e6b](https://github.com/ng-bootstrap/ng-bootstrap/commit/89c1e6b)), closes [#1094](https://github.com/ng-bootstrap/ng-bootstrap/issues/1094) [#1258](https://github.com/ng-bootstrap/ng-bootstrap/issues/1258)



<a name="1.0.0-alpha.19"></a>
# [1.0.0-alpha.19](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.18...1.0.0-alpha.19) (2017-01-25)

This release comes with many improvements to the datepicker: better layout as well as look & feel.
We are also bumping up minimal Angular version to 2.3.1 - this is required so we can provide better APIs for modal. 

### Chores

* update angular version ([43b8e2b](https://github.com/ng-bootstrap/ng-bootstrap/commit/43b8e2b))

### Bug Fixes

* **datepicker:** account for undefined values in ngOnChanges ([8803847](https://github.com/ng-bootstrap/ng-bootstrap/commit/8803847)), closes [#1202](https://github.com/ng-bootstrap/ng-bootstrap/issues/1202) [#1229](https://github.com/ng-bootstrap/ng-bootstrap/issues/1229)
* **dropdown:** do not close dropdown on right button click ([b6bb9e9](https://github.com/ng-bootstrap/ng-bootstrap/commit/b6bb9e9)), closes [#1211](https://github.com/ng-bootstrap/ng-bootstrap/issues/1211)
* **pagination:** fix unnecessary ellipsis between sibling page numbers ([b607652](https://github.com/ng-bootstrap/ng-bootstrap/commit/b607652)), closes [#1166](https://github.com/ng-bootstrap/ng-bootstrap/issues/1166) [#1232](https://github.com/ng-bootstrap/ng-bootstrap/issues/1232) [#1233](https://github.com/ng-bootstrap/ng-bootstrap/issues/1233)

### Features

* **datepicker:** add full month name versions to i18n ([106fa82](https://github.com/ng-bootstrap/ng-bootstrap/commit/106fa82)), closes [#1217](https://github.com/ng-bootstrap/ng-bootstrap/issues/1217)
* **datepicker:** improve default look and feel ([d88c8b7](https://github.com/ng-bootstrap/ng-bootstrap/commit/d88c8b7)), closes [#706](https://github.com/ng-bootstrap/ng-bootstrap/issues/706) [#1061](https://github.com/ng-bootstrap/ng-bootstrap/issues/1061) [#1205](https://github.com/ng-bootstrap/ng-bootstrap/issues/1205)
* **tabset:** add an option for tabs horizontal alignment ([00114f3](https://github.com/ng-bootstrap/ng-bootstrap/commit/00114f3)), closes [#1210](https://github.com/ng-bootstrap/ng-bootstrap/issues/1210)


### BREAKING CHANGES

* minimal angular version was updated to 2.3.1.
Angular@^2.3.1 will have to be used as a peer dependency from now on.

* datepicker: `NgbDatepickerI18n` methods were renamed:

`getWeekdayName` to `getWeekdayShortName`
`getMonthName` to `getMonthShortName`

* datepicker: switched to flex layout instead of table-based (drop IE9 support) and prefixed datepicker-related css classes with `ngb-dp-`



<a name="1.0.0-alpha.18"></a>
# [1.0.0-alpha.18](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.17...1.0.0-alpha.18) (2017-01-09)

This release adds full compatibility with Bootstrap CSS version 4.0.0-alpha.6!

### Chores

* upgrade documentation to bootstrap-4.0.0-alpha.6 ([4499927](https://github.com/ng-bootstrap/ng-bootstrap/commit/4499927)), closes [#1192](https://github.com/ng-bootstrap/ng-bootstrap/issues/1192)


### Features

* **carousel:** upgrade carousel to v4-alpha.6 ([e9f539a](https://github.com/ng-bootstrap/ng-bootstrap/commit/e9f539a)), closes [#1190](https://github.com/ng-bootstrap/ng-bootstrap/issues/1190)
* **collapse:** upgrade collapse to v4-alpha.6 ([6cda8b3](https://github.com/ng-bootstrap/ng-bootstrap/commit/6cda8b3)), closes [#1183](https://github.com/ng-bootstrap/ng-bootstrap/issues/1183)
* **datepicker:** upgrade datepicker to v4-alpha.6 ([b60e2d7](https://github.com/ng-bootstrap/ng-bootstrap/commit/b60e2d7)), closes [#1187](https://github.com/ng-bootstrap/ng-bootstrap/issues/1187)
* **dropdown:** upgrade to 4.0.0-alpha.6 ([d8bfe37](https://github.com/ng-bootstrap/ng-bootstrap/commit/d8bfe37)), closes [#1180](https://github.com/ng-bootstrap/ng-bootstrap/issues/1180) [#1182](https://github.com/ng-bootstrap/ng-bootstrap/issues/1182)
* **modal:** upgrade modal to v4-alpha.6 ([7ab022b](https://github.com/ng-bootstrap/ng-bootstrap/commit/7ab022b)), closes [#1185](https://github.com/ng-bootstrap/ng-bootstrap/issues/1185)
* **popover:** upgrade popover to v4-alpha.6 ([60fd5d9](https://github.com/ng-bootstrap/ng-bootstrap/commit/60fd5d9)), closes [#1189](https://github.com/ng-bootstrap/ng-bootstrap/issues/1189)
* **timepicker:** upgrade timepicker to v4-alpha.6 ([4288e22](https://github.com/ng-bootstrap/ng-bootstrap/commit/4288e22)), closes [#1186](https://github.com/ng-bootstrap/ng-bootstrap/issues/1186)
* **tooltip:** upgrade tooltip to v4-alpha.6 ([0000aa3](https://github.com/ng-bootstrap/ng-bootstrap/commit/0000aa3)), closes [#1188](https://github.com/ng-bootstrap/ng-bootstrap/issues/1188)


### BREAKING CHANGES

* This version is compatible with bootstrap-4.0.0-alpha.6, and is not backward-compatible with previous versions of bootstrap. If you choose to upgrade to this version of ng-bootstrap, you will thus also have to migrate to bootstrap-4.0.0-alpha.6.



<a name="1.0.0-alpha.17"></a>
# [1.0.0-alpha.17](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.16...1.0.0-alpha.17) (2017-01-09)

This is a very small release that restores TypeScript 1.8 compatibility. 
Additionally it and fixes plunks to work with Bootstrap version 4.0.0-alpha.5 
(this is in preparation for full support of Bootstrap 4.0.0-alpha.6)

### Bug Fixes

* **buttons:** restore TS 1.8 compatibility ([8cd6c62](https://github.com/ng-bootstrap/ng-bootstrap/commit/8cd6c62)), closes [#1175](https://github.com/ng-bootstrap/ng-bootstrap/issues/1175) [#1176](https://github.com/ng-bootstrap/ng-bootstrap/issues/1176)



<a name="1.0.0-alpha.16"></a>
# [1.0.0-alpha.16](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.15...1.0.0-alpha.16) (2017-01-02)


### Bug Fixes

* **buttons:** properly manage disabled state of group interactions ([e24f4c6](https://github.com/ng-bootstrap/ng-bootstrap/commit/e24f4c6)), closes [#1143](https://github.com/ng-bootstrap/ng-bootstrap/issues/1143) [#1148](https://github.com/ng-bootstrap/ng-bootstrap/issues/1148)


### Features

* export all directives ([4554855](https://github.com/ng-bootstrap/ng-bootstrap/commit/4554855)), closes [#779](https://github.com/ng-bootstrap/ng-bootstrap/issues/779) [#1154](https://github.com/ng-bootstrap/ng-bootstrap/issues/1154)
* **pagination:** add disabled state support ([2827e50](https://github.com/ng-bootstrap/ng-bootstrap/commit/2827e50)), closes [#1153](https://github.com/ng-bootstrap/ng-bootstrap/issues/1153) [#1155](https://github.com/ng-bootstrap/ng-bootstrap/issues/1155)
* **popover:** pass context to popup open method ([87d569b](https://github.com/ng-bootstrap/ng-bootstrap/commit/87d569b)), closes [#1145](https://github.com/ng-bootstrap/ng-bootstrap/issues/1145)



<a name="1.0.0-alpha.15"></a>
# [1.0.0-alpha.15](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.14...1.0.0-alpha.15) (2016-12-15)


### Bug Fixes

* **buttons:** properly handle disabled property on a button level ([cc88ed2](https://github.com/ng-bootstrap/ng-bootstrap/commit/cc88ed2)), closes [#1088](https://github.com/ng-bootstrap/ng-bootstrap/issues/1088) [#1089](https://github.com/ng-bootstrap/ng-bootstrap/issues/1089) [#1095](https://github.com/ng-bootstrap/ng-bootstrap/issues/1095) [#1141](https://github.com/ng-bootstrap/ng-bootstrap/issues/1141)
* **datepicker:** protect against invalid min, max and start dates ([186c0e1](https://github.com/ng-bootstrap/ng-bootstrap/commit/186c0e1)), closes [#1062](https://github.com/ng-bootstrap/ng-bootstrap/issues/1062) [#1092](https://github.com/ng-bootstrap/ng-bootstrap/issues/1092)
* **datepicker:** use `td` in arrows navigation ([6b8827a](https://github.com/ng-bootstrap/ng-bootstrap/commit/6b8827a)), closes [#1086](https://github.com/ng-bootstrap/ng-bootstrap/issues/1086)
* **pagination:** prevent focus of disabled selectors ([733fc54](https://github.com/ng-bootstrap/ng-bootstrap/commit/733fc54)), closes [#1108](https://github.com/ng-bootstrap/ng-bootstrap/issues/1108) [#1114](https://github.com/ng-bootstrap/ng-bootstrap/issues/1114) [#1114](https://github.com/ng-bootstrap/ng-bootstrap/issues/1114)


### Features

* **accordion:** add aria-selected ([d1abd37](https://github.com/ng-bootstrap/ng-bootstrap/commit/d1abd37)), closes [#1109](https://github.com/ng-bootstrap/ng-bootstrap/issues/1109)
* **rating:** enable form integration ([c090a5a](https://github.com/ng-bootstrap/ng-bootstrap/commit/c090a5a)), closes [#1087](https://github.com/ng-bootstrap/ng-bootstrap/issues/1087) [#1097](https://github.com/ng-bootstrap/ng-bootstrap/issues/1097)
* **tabs:** add aria ([97f116f](https://github.com/ng-bootstrap/ng-bootstrap/commit/97f116f)), closes [#1118](https://github.com/ng-bootstrap/ng-bootstrap/issues/1118) [#1120](https://github.com/ng-bootstrap/ng-bootstrap/issues/1120)


### BREAKING CHANGES

* rating: event emitter behind the 'rateChange' output emits asynchronously now



<a name="1.0.0-alpha.14"></a>
# [1.0.0-alpha.14](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.13...1.0.0-alpha.14) (2016-11-25)


### Bug Fixes

* **datepicker:** navigation restrictions work with min- and maxDate ([a12c559](https://github.com/ng-bootstrap/ng-bootstrap/commit/a12c559)), closes [#1057](https://github.com/ng-bootstrap/ng-bootstrap/issues/1057) [#1077](https://github.com/ng-bootstrap/ng-bootstrap/issues/1077)
* **demo:** upgrade webpack and loaders ([994deda](https://github.com/ng-bootstrap/ng-bootstrap/commit/994deda)), closes [#1047](https://github.com/ng-bootstrap/ng-bootstrap/issues/1047) [#1048](https://github.com/ng-bootstrap/ng-bootstrap/issues/1048)
* **modal:** stricter interpretation of backdrop clicks ([3af8329](https://github.com/ng-bootstrap/ng-bootstrap/commit/3af8329)), closes [#1040](https://github.com/ng-bootstrap/ng-bootstrap/issues/1040) [#1042](https://github.com/ng-bootstrap/ng-bootstrap/issues/1042) [#1067](https://github.com/ng-bootstrap/ng-bootstrap/issues/1067)
* **progressbar:** progress stays striped when type changes ([e3af043](https://github.com/ng-bootstrap/ng-bootstrap/commit/e3af043)), closes [#1035](https://github.com/ng-bootstrap/ng-bootstrap/issues/1035) [#1038](https://github.com/ng-bootstrap/ng-bootstrap/issues/1038)
* **rating:** restore update on click functionality ([a64a8a0](https://github.com/ng-bootstrap/ng-bootstrap/commit/a64a8a0)), closes [#1072](https://github.com/ng-bootstrap/ng-bootstrap/issues/1072) [#1074](https://github.com/ng-bootstrap/ng-bootstrap/issues/1074)
* **timepicker:** display 12 PM/AM when merdian is true ([91ca518](https://github.com/ng-bootstrap/ng-bootstrap/commit/91ca518)), closes [#1031](https://github.com/ng-bootstrap/ng-bootstrap/issues/1031) [#1033](https://github.com/ng-bootstrap/ng-bootstrap/issues/1033)
* **typeahead:** clear model on user input when editable=false ([cfbc24a](https://github.com/ng-bootstrap/ng-bootstrap/commit/cfbc24a)), closes [#829](https://github.com/ng-bootstrap/ng-bootstrap/issues/829) [#1083](https://github.com/ng-bootstrap/ng-bootstrap/issues/1083)


### Features

* **accordion:** add aria attributes ([ed5d4ca](https://github.com/ng-bootstrap/ng-bootstrap/commit/ed5d4ca)), closes [#1070](https://github.com/ng-bootstrap/ng-bootstrap/issues/1070)
* **typeahead:** do not trap keydown enter event ([1702df9](https://github.com/ng-bootstrap/ng-bootstrap/commit/1702df9)), closes [#958](https://github.com/ng-bootstrap/ng-bootstrap/issues/958) [#877](https://github.com/ng-bootstrap/ng-bootstrap/issues/877) [#980](https://github.com/ng-bootstrap/ng-bootstrap/issues/980) [#1032](https://github.com/ng-bootstrap/ng-bootstrap/issues/1032) [#1032](https://github.com/ng-bootstrap/ng-bootstrap/issues/1032)



<a name="1.0.0-alpha.13"></a>
# [1.0.0-alpha.13](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.12...1.0.0-alpha.13) (2016-11-11)

This is a very small release that fixes a problem in the generated Typescript definition files (#1027).

### Bug Fixes

* don't add references to core-js in d.ts files ([d18b103](https://github.com/ng-bootstrap/ng-bootstrap/commit/d18b103)), closes [#1027](https://github.com/ng-bootstrap/ng-bootstrap/issues/1027) [#1028](https://github.com/ng-bootstrap/ng-bootstrap/issues/1028)



<a name="1.0.0-alpha.12"></a>
# [1.0.0-alpha.12](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.11...1.0.0-alpha.12) (2016-11-10)


### Bug Fixes

* **carousel:** enable key auto-repeat ([fb6294d](https://github.com/ng-bootstrap/ng-bootstrap/commit/fb6294d)), closes [#1025](https://github.com/ng-bootstrap/ng-bootstrap/issues/1025)
* **modal:** don't stop propagation of click events from content ([6a2c074](https://github.com/ng-bootstrap/ng-bootstrap/commit/6a2c074)), closes [#1011](https://github.com/ng-bootstrap/ng-bootstrap/issues/1011) [#1013](https://github.com/ng-bootstrap/ng-bootstrap/issues/1013)
* **typeahead:** properly respect focusFirst option ([282a089](https://github.com/ng-bootstrap/ng-bootstrap/commit/282a089)), closes [#876](https://github.com/ng-bootstrap/ng-bootstrap/issues/876) [#1021](https://github.com/ng-bootstrap/ng-bootstrap/issues/1021)


### Features

* **datepicker:** add navigation notification with 'navigate' output ([1639626](https://github.com/ng-bootstrap/ng-bootstrap/commit/1639626)), closes [#986](https://github.com/ng-bootstrap/ng-bootstrap/issues/986) [#1002](https://github.com/ng-bootstrap/ng-bootstrap/issues/1002)
* **rating:** add keyboard support ([da0b6a0](https://github.com/ng-bootstrap/ng-bootstrap/commit/da0b6a0)), closes [#1015](https://github.com/ng-bootstrap/ng-bootstrap/issues/1015)



<a name="1.0.0-alpha.11"></a>
# [1.0.0-alpha.11](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.10...1.0.0-alpha.11) (2016-11-03)


### Bug Fixes

* **modal:** restore backdrop: false functionality ([0e2f386](https://github.com/ng-bootstrap/ng-bootstrap/commit/0e2f386)), closes [#989](https://github.com/ng-bootstrap/ng-bootstrap/issues/989) [#990](https://github.com/ng-bootstrap/ng-bootstrap/issues/990)
* **modal:** use Injector of NgbModal for component content ([5172884](https://github.com/ng-bootstrap/ng-bootstrap/commit/5172884)), closes [#982](https://github.com/ng-bootstrap/ng-bootstrap/issues/982) [#983](https://github.com/ng-bootstrap/ng-bootstrap/issues/983)
* **pagination:** better protect against invalid inputs ([a6ec937](https://github.com/ng-bootstrap/ng-bootstrap/commit/a6ec937)), closes [#898](https://github.com/ng-bootstrap/ng-bootstrap/issues/898) [#979](https://github.com/ng-bootstrap/ng-bootstrap/issues/979)
* **rating:** restore compatibility with TypeScript 1.8 ([951e538](https://github.com/ng-bootstrap/ng-bootstrap/commit/951e538)), closes [#995](https://github.com/ng-bootstrap/ng-bootstrap/issues/995) [#996](https://github.com/ng-bootstrap/ng-bootstrap/issues/996)


### Features

* **datepicker:** ability to display several months ([a65cc30](https://github.com/ng-bootstrap/ng-bootstrap/commit/a65cc30)), closes [#977](https://github.com/ng-bootstrap/ng-bootstrap/issues/977)


### BREAKING CHANGES

* datepicker: datepicker navigation now must be hidden with `navigation='none'`and not `[showNavigation]='false'` as prevoiusly



<a name="1.0.0-alpha.10"></a>
# [1.0.0-alpha.10](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.9...1.0.0-alpha.10) (2016-10-28)

### Bug Fixes

* restore AoT compatibility with 2.1.x ([991c880](https://github.com/ng-bootstrap/ng-bootstrap/commit/991c880)), closes [#953](https://github.com/ng-bootstrap/ng-bootstrap/issues/953) [#973](https://github.com/ng-bootstrap/ng-bootstrap/issues/973)
* restore TypeScript 1.8 compatibility ([e077ccc](https://github.com/ng-bootstrap/ng-bootstrap/commit/e077ccc)), closes [#940](https://github.com/ng-bootstrap/ng-bootstrap/issues/940) [#941](https://github.com/ng-bootstrap/ng-bootstrap/issues/941)
* **accordion:** remove unnecessary tabindex usage ([a240bea](https://github.com/ng-bootstrap/ng-bootstrap/commit/a240bea)), closes [#942](https://github.com/ng-bootstrap/ng-bootstrap/issues/942) [#943](https://github.com/ng-bootstrap/ng-bootstrap/issues/943)
* **modal:** make it easier to use components from lazy-loaded modules ([2fb72d8](https://github.com/ng-bootstrap/ng-bootstrap/commit/2fb72d8)), closes [#947](https://github.com/ng-bootstrap/ng-bootstrap/issues/947) [#974](https://github.com/ng-bootstrap/ng-bootstrap/issues/974)
* **rating:** improves rating accessibility ([9b5f999](https://github.com/ng-bootstrap/ng-bootstrap/commit/9b5f999)), closes [#962](https://github.com/ng-bootstrap/ng-bootstrap/issues/962)

<a name="1.0.0-alpha.9"></a>
# [1.0.0-alpha.9](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.8...1.0.0-alpha.9) (2016-10-21)


### Bug Fixes

* restore TypeScript 1.8 compatibility ([1259d37](https://github.com/ng-bootstrap/ng-bootstrap/commit/1259d37)), closes [#904](https://github.com/ng-bootstrap/ng-bootstrap/issues/904) [#911](https://github.com/ng-bootstrap/ng-bootstrap/issues/911)
* **buttons:** properly handle focus on radio buttons ([23d412b](https://github.com/ng-bootstrap/ng-bootstrap/commit/23d412b)), closes [#913](https://github.com/ng-bootstrap/ng-bootstrap/issues/913)
* **datepicker:** propagate "touched" property ([deadb67](https://github.com/ng-bootstrap/ng-bootstrap/commit/deadb67)), closes [#918](https://github.com/ng-bootstrap/ng-bootstrap/issues/918) [#924](https://github.com/ng-bootstrap/ng-bootstrap/issues/924)
* **popover:** properly destroy popovers using container option ([19bb887](https://github.com/ng-bootstrap/ng-bootstrap/commit/19bb887)), closes [#931](https://github.com/ng-bootstrap/ng-bootstrap/issues/931)
* **timepicker:** properly display chevrons in Safari on iOS ([cbfa23b](https://github.com/ng-bootstrap/ng-bootstrap/commit/cbfa23b)), closes [#908](https://github.com/ng-bootstrap/ng-bootstrap/issues/908) [#909](https://github.com/ng-bootstrap/ng-bootstrap/issues/909)
* **timepicker:** properly display chevrons in older IEs ([54cd30b](https://github.com/ng-bootstrap/ng-bootstrap/commit/54cd30b)), closes [#935](https://github.com/ng-bootstrap/ng-bootstrap/issues/935)
* **tooltip:** properly destroy tooltips using container option ([94a4d5c](https://github.com/ng-bootstrap/ng-bootstrap/commit/94a4d5c)), closes [#910](https://github.com/ng-bootstrap/ng-bootstrap/issues/910) [#912](https://github.com/ng-bootstrap/ng-bootstrap/issues/912)


### Features

* **datepicker:** can easily hide days outside of current month ([a92c0e7](https://github.com/ng-bootstrap/ng-bootstrap/commit/a92c0e7)), closes [#937](https://github.com/ng-bootstrap/ng-bootstrap/issues/937)
* **modal:** allow interactions with components passed as content ([cc4ffb0](https://github.com/ng-bootstrap/ng-bootstrap/commit/cc4ffb0)), closes [#861](https://github.com/ng-bootstrap/ng-bootstrap/issues/861) [#903](https://github.com/ng-bootstrap/ng-bootstrap/issues/903)
* **modals:** stack modals in opening order ([20ad457](https://github.com/ng-bootstrap/ng-bootstrap/commit/20ad457)), closes [#902](https://github.com/ng-bootstrap/ng-bootstrap/issues/902) [#901](https://github.com/ng-bootstrap/ng-bootstrap/issues/901)



<a name="1.0.0-alpha.8"></a>
# [1.0.0-alpha.8](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.7...1.0.0-alpha.8) (2016-10-14)


### Bug Fixes

* **build:** properly reference rxjs from the UMD bundle ([53115da](https://github.com/ng-bootstrap/ng-bootstrap/commit/53115da)), closes [#884](https://github.com/ng-bootstrap/ng-bootstrap/issues/884)
* **modal:** don't error on dismiss without result handler ([21de54c](https://github.com/ng-bootstrap/ng-bootstrap/commit/21de54c)), closes [#880](https://github.com/ng-bootstrap/ng-bootstrap/issues/880) [#885](https://github.com/ng-bootstrap/ng-bootstrap/issues/885)
* **pagination:** emits pageChange when collection size changes ([84d555c](https://github.com/ng-bootstrap/ng-bootstrap/commit/84d555c)), closes [#800](https://github.com/ng-bootstrap/ng-bootstrap/issues/800) [#868](https://github.com/ng-bootstrap/ng-bootstrap/issues/868)
* **radio:** don't shadow checked attribute when not using buttons ([de7d0e4](https://github.com/ng-bootstrap/ng-bootstrap/commit/de7d0e4)), closes [#840](https://github.com/ng-bootstrap/ng-bootstrap/issues/840) [#874](https://github.com/ng-bootstrap/ng-bootstrap/issues/874)


### Features

* **popover:** add support for the 'container' option ([d1a22c0](https://github.com/ng-bootstrap/ng-bootstrap/commit/d1a22c0)), closes [#852](https://github.com/ng-bootstrap/ng-bootstrap/issues/852) [#853](https://github.com/ng-bootstrap/ng-bootstrap/issues/853)
* **tooltip:** add support for the 'container' option ([b8230e5](https://github.com/ng-bootstrap/ng-bootstrap/commit/b8230e5)), closes [#621](https://github.com/ng-bootstrap/ng-bootstrap/issues/621) [#871](https://github.com/ng-bootstrap/ng-bootstrap/issues/871)
* **typeahead:** add support for the focusFirst option ([e86277f](https://github.com/ng-bootstrap/ng-bootstrap/commit/e86277f)), closes [#748](https://github.com/ng-bootstrap/ng-bootstrap/issues/748) [#856](https://github.com/ng-bootstrap/ng-bootstrap/issues/856)



<a name="1.0.0-alpha.7"></a>
# [1.0.0-alpha.7](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.6...1.0.0-alpha.7) (2016-10-10)

This release restores full AoT compatibility and has proper support for lazy-loaded `NgbModule`. On top of this we are 
shipping a lot of new features and bug fixes - details below. 

### Bug Fixes

* restore full AoT compatibility ([2101a89](https://github.com/ng-bootstrap/ng-bootstrap/commit/2101a89)), closes [#796](https://github.com/ng-bootstrap/ng-bootstrap/issues/796) [#854](https://github.com/ng-bootstrap/ng-bootstrap/issues/854)
* **buttons:** use disabled state from a control ([d9495db](https://github.com/ng-bootstrap/ng-bootstrap/commit/d9495db)), closes [#805](https://github.com/ng-bootstrap/ng-bootstrap/issues/805) [#828](https://github.com/ng-bootstrap/ng-bootstrap/issues/828)
* **datepicker:** replace not-allowed cursor with default one ([807c7e7](https://github.com/ng-bootstrap/ng-bootstrap/commit/807c7e7)), closes [#850](https://github.com/ng-bootstrap/ng-bootstrap/issues/850)
* **datepicker:** use ISO 8601 for month and weekday numbers ([#797](https://github.com/ng-bootstrap/ng-bootstrap/issues/797)) ([a173e40](https://github.com/ng-bootstrap/ng-bootstrap/commit/a173e40)), closes [#728](https://github.com/ng-bootstrap/ng-bootstrap/issues/728)
* **dropdown:** properly close dropdown on child elements click ([fdf8d4b](https://github.com/ng-bootstrap/ng-bootstrap/commit/fdf8d4b)), closes [#803](https://github.com/ng-bootstrap/ng-bootstrap/issues/803) [#810](https://github.com/ng-bootstrap/ng-bootstrap/issues/810)
* **modal:** support modals in lazy loaded modules ([#799](https://github.com/ng-bootstrap/ng-bootstrap/issues/799)) ([eca26cd](https://github.com/ng-bootstrap/ng-bootstrap/commit/eca26cd)), closes [#784](https://github.com/ng-bootstrap/ng-bootstrap/issues/784)
* **modal:** properly destroy content views ([3cdb0ff](https://github.com/ng-bootstrap/ng-bootstrap/commit/3cdb0ff)), closes [#806](https://github.com/ng-bootstrap/ng-bootstrap/issues/806) [#826](https://github.com/ng-bootstrap/ng-bootstrap/issues/826)
* **popover:** properly cleanup content passed as TemplateRef ([8246541](https://github.com/ng-bootstrap/ng-bootstrap/commit/8246541)), closes [#827](https://github.com/ng-bootstrap/ng-bootstrap/issues/827) [#830](https://github.com/ng-bootstrap/ng-bootstrap/issues/830)
* **rating:** replace not-allowed cursor with default one ([e888d67](https://github.com/ng-bootstrap/ng-bootstrap/commit/e888d67)), closes [#851](https://github.com/ng-bootstrap/ng-bootstrap/issues/851)

### Features

* **carousel:** add support to turn off interval ([c5625e8](https://github.com/ng-bootstrap/ng-bootstrap/commit/c5625e8)), closes [#804](https://github.com/ng-bootstrap/ng-bootstrap/issues/804)
* **datepicker:** infer startDate from model value ([4fc52c1](https://github.com/ng-bootstrap/ng-bootstrap/commit/4fc52c1)), closes [#843](https://github.com/ng-bootstrap/ng-bootstrap/issues/843) [#844](https://github.com/ng-bootstrap/ng-bootstrap/issues/844)
* **datepicker:** pass current month value to 'markDisabled' callback ([afe6342](https://github.com/ng-bootstrap/ng-bootstrap/commit/afe6342)), closes [#849](https://github.com/ng-bootstrap/ng-bootstrap/issues/849)
* **modal:** add support for custom windowClass on modals ([ff132d7](https://github.com/ng-bootstrap/ng-bootstrap/commit/ff132d7)), closes [#818](https://github.com/ng-bootstrap/ng-bootstrap/issues/818) [#845](https://github.com/ng-bootstrap/ng-bootstrap/issues/845)
* **modal:** allow components as content ([ecdd3a0](https://github.com/ng-bootstrap/ng-bootstrap/commit/ecdd3a0)), closes [#680](https://github.com/ng-bootstrap/ng-bootstrap/issues/680) [#727](https://github.com/ng-bootstrap/ng-bootstrap/issues/727) [#846](https://github.com/ng-bootstrap/ng-bootstrap/issues/846)
* **popover:** add isOpen() and shown/hidden events ([3bbf512](https://github.com/ng-bootstrap/ng-bootstrap/commit/3bbf512)), closes [#841](https://github.com/ng-bootstrap/ng-bootstrap/issues/841)
* **rating:** allow custom star templates ([29c44cd](https://github.com/ng-bootstrap/ng-bootstrap/commit/29c44cd)), closes [#815](https://github.com/ng-bootstrap/ng-bootstrap/issues/815)
* **rating:** allow decimal numbers as rating values ([964d8cf](https://github.com/ng-bootstrap/ng-bootstrap/commit/964d8cf)), closes [#817](https://github.com/ng-bootstrap/ng-bootstrap/issues/817)
* **tooltip:** add isOpen() and show/hide events ([91c6054](https://github.com/ng-bootstrap/ng-bootstrap/commit/91c6054)), closes [#842](https://github.com/ng-bootstrap/ng-bootstrap/issues/842)


### BREAKING CHANGES

* The `NgbModule` module must now import using the forRoot() static method. Check the updated [installation instructions](https://github.com/ng-bootstrap/ng-bootstrap#installation) for more details.
* datepicker: now datepicker uses ISO 8601 for month and weekday numbers with default calendar

Before:

`0=Jan; 1=Feb; ... 11=Dec` 

`0=Sun; 1=Mon; ... 6=Sat`

After:

`1=Jan; 2=Feb; ... 12=Dec`

`1=Mon; 2=Tue; ... 7=Sun`



<a name="1.0.0-alpha.6"></a>
# [1.0.0-alpha.6](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.5...1.0.0-alpha.6) (2016-09-23)


### Bug Fixes

* **accordion:** rename change event to avoid conflicts ([21eb610](https://github.com/ng-bootstrap/ng-bootstrap/commit/21eb610)), closes [#751](https://github.com/ng-bootstrap/ng-bootstrap/issues/751) [#756](https://github.com/ng-bootstrap/ng-bootstrap/issues/756)
* **dropdown:** support autoClose when several dropdowns exist ([e2e7c1b](https://github.com/ng-bootstrap/ng-bootstrap/commit/e2e7c1b)), closes [#687](https://github.com/ng-bootstrap/ng-bootstrap/issues/687) [#785](https://github.com/ng-bootstrap/ng-bootstrap/issues/785)
* **popover:** avoid shadowing of the native title property ([2577efd](https://github.com/ng-bootstrap/ng-bootstrap/commit/2577efd)), closes [#736](https://github.com/ng-bootstrap/ng-bootstrap/issues/736) [#757](https://github.com/ng-bootstrap/ng-bootstrap/issues/757)
* **popover:** properly handle components using OnPush strategy ([40bde5e](https://github.com/ng-bootstrap/ng-bootstrap/commit/40bde5e)), closes [#781](https://github.com/ng-bootstrap/ng-bootstrap/issues/781)
* **tabset:** rename change event to avoid conflicts with native ones ([9d2754f](https://github.com/ng-bootstrap/ng-bootstrap/commit/9d2754f)), closes [#741](https://github.com/ng-bootstrap/ng-bootstrap/issues/741) [#747](https://github.com/ng-bootstrap/ng-bootstrap/issues/747)
* **tooltip:** hide, or avoid opening the tooltip if its value is falsy ([31a035b](https://github.com/ng-bootstrap/ng-bootstrap/commit/31a035b)), closes [#737](https://github.com/ng-bootstrap/ng-bootstrap/issues/737) [#745](https://github.com/ng-bootstrap/ng-bootstrap/issues/745)
* **tooltip:** properly handle components using OnPush strategy ([667833c](https://github.com/ng-bootstrap/ng-bootstrap/commit/667833c)), closes [#772](https://github.com/ng-bootstrap/ng-bootstrap/issues/772) [#777](https://github.com/ng-bootstrap/ng-bootstrap/issues/777)
* **typeahead:** properly handle components using OnPush strategy ([a2ba68a](https://github.com/ng-bootstrap/ng-bootstrap/commit/a2ba68a)), closes [#775](https://github.com/ng-bootstrap/ng-bootstrap/issues/775)


### Features

* **alert:** remove self-closing alert component ([79e393d](https://github.com/ng-bootstrap/ng-bootstrap/commit/79e393d)), closes [#758](https://github.com/ng-bootstrap/ng-bootstrap/issues/758)
* **datepicker:** allow parsing and formatting dates in a custom way ([401fcfa](https://github.com/ng-bootstrap/ng-bootstrap/commit/401fcfa)), closes [#755](https://github.com/ng-bootstrap/ng-bootstrap/issues/755)
* **typeahead:** add support for the "editable" option ([cb91905](https://github.com/ng-bootstrap/ng-bootstrap/commit/cb91905)), closes [#788](https://github.com/ng-bootstrap/ng-bootstrap/issues/788) [#789](https://github.com/ng-bootstrap/ng-bootstrap/issues/789)


### BREAKING CHANGES

* alert: the `NgbSelfClosingAlert` component has been removed.
Check the self-closing alert demo to know how to achieve the same thing with `NgbAlert`.
* accordion: the `change` event on the accordion level was renamed to `panelChange`.

Before:

`<ngb-accordion (change)="...">`

After:

`<ngb-accordion (panelChange)="...">`

* popover: the title property of the popover directive was renamed to popoverTitle.

Before:

`<div ngbPopover="..." title="...">`

After:

`<div ngbPopover="..." popoverTitle="...">`

* tabset: the `change` event on the tabset level was renamed to `tabChange`.

Before:

`<ngb-tabset (change)="...">`

After:

`<ngb-tabset (tabChange)="...">`



<a name="1.0.0-alpha.5"></a>
# [1.0.0-alpha.5](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.4...1.0.0-alpha.5) (2016-09-15)

This release brings support for datepicker in popups - we believe that there is a solid widget here!
Alpha.5 changes content of npm package to enable AoT compilation with tree-shaking.   
There are also small features and bug fixes for the existing widgets - see the details below.


### Bug Fixes

* **popover:** properly re-position popovers ([a729ba9](https://github.com/ng-bootstrap/ng-bootstrap/commit/a729ba9)), closes [#710](https://github.com/ng-bootstrap/ng-bootstrap/issues/710)
* **tooltip:** properly re-position tooltips ([6748a78](https://github.com/ng-bootstrap/ng-bootstrap/commit/6748a78)), closes [#709](https://github.com/ng-bootstrap/ng-bootstrap/issues/709)
* **typeahead:** properly re-position typeahead window ([2f59666](https://github.com/ng-bootstrap/ng-bootstrap/commit/2f59666)), closes [#707](https://github.com/ng-bootstrap/ng-bootstrap/issues/707) [#714](https://github.com/ng-bootstrap/ng-bootstrap/issues/714)
* **typeahead:** properly support disabled inputs ([bf61640](https://github.com/ng-bootstrap/ng-bootstrap/commit/bf61640)), closes [#703](https://github.com/ng-bootstrap/ng-bootstrap/issues/703)


### Features

* **datepicker:** add support for datepickers in popups ([390935b](https://github.com/ng-bootstrap/ng-bootstrap/commit/390935b)), closes [#715](https://github.com/ng-bootstrap/ng-bootstrap/issues/715)
* **datepicker:** add background color when hovering day ([bc89510](https://github.com/ng-bootstrap/ng-bootstrap/commit/bc89510)), closes [#713](https://github.com/ng-bootstrap/ng-bootstrap/issues/713)
* **datepicker:** add support for disabled datepicker ([64ec99c](https://github.com/ng-bootstrap/ng-bootstrap/commit/64ec99c)), closes [#702](https://github.com/ng-bootstrap/ng-bootstrap/issues/702)
* **timepicker:** propagate second as 0 if seconds not displayed ([c1c68b0](https://github.com/ng-bootstrap/ng-bootstrap/commit/c1c68b0)), closes [#711](https://github.com/ng-bootstrap/ng-bootstrap/issues/711)
* **typeahead:** add config service to provide default values ([237b4d5](https://github.com/ng-bootstrap/ng-bootstrap/commit/237b4d5)), closes [#518](https://github.com/ng-bootstrap/ng-bootstrap/issues/518) [#697](https://github.com/ng-bootstrap/ng-bootstrap/issues/697)
* **typeahead:** allow veto of an item selection ([e793944](https://github.com/ng-bootstrap/ng-bootstrap/commit/e793944)), closes [#699](https://github.com/ng-bootstrap/ng-bootstrap/issues/699) [#733](https://github.com/ng-bootstrap/ng-bootstrap/issues/733)


### BREAKING CHANGES

* typeahead: payload of the typeahead's `selectItem` event was changed - now it is
an object implementing the `NgbTypeaheadSelectItemEvent`. You can easily migrate your existing
code by changing:

`<input [ngbTypeahead]="find" (selectItem)="onSelect($event)"/>`

to

`<input [ngbTypeahead]="find" (selectItem)="onSelect($event.item)"/>`

* build: npm package: code in ESM (ES6 Modules) format is now published at the default location in the npm package with `package.json`'s `main` entry pointing to an UMD bundle (primarily for node and webpack 1 users).

If you are using SystemJS, you should adjust your configuration to point to the UMD bundle.



<a name="1.0.0-alpha.4"></a>
# [1.0.0-alpha.4](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.3...1.0.0-alpha.4) (2016-09-07)

This release brings a new component - datepicker! Additionally all widgets now support global config through an injectable service.  
There are also small features and bug fixes for the existing widgets - see the details below.

### Bug Fixes

* **dropdown:** don't emit duplicate change events ([2e529e3](https://github.com/ng-bootstrap/ng-bootstrap/commit/2e529e3)), closes [#694](https://github.com/ng-bootstrap/ng-bootstrap/issues/694) [#695](https://github.com/ng-bootstrap/ng-bootstrap/issues/695)
* **timepicker:** spinners don't submit form anymore ([f131990](https://github.com/ng-bootstrap/ng-bootstrap/commit/f131990)), closes [#690](https://github.com/ng-bootstrap/ng-bootstrap/issues/690) [#691](https://github.com/ng-bootstrap/ng-bootstrap/issues/691)
* **typeahead:** navigation buttons don't submit form anymore ([79f4597](https://github.com/ng-bootstrap/ng-bootstrap/commit/79f4597)), closes [#693](https://github.com/ng-bootstrap/ng-bootstrap/issues/693)


### Features

* **accordion:** add config service to provide default values ([1c290a2](https://github.com/ng-bootstrap/ng-bootstrap/commit/1c290a2)), closes [#655](https://github.com/ng-bootstrap/ng-bootstrap/issues/655)
* **alert:** add config service to provide default values ([e666c61](https://github.com/ng-bootstrap/ng-bootstrap/commit/e666c61)), closes [#661](https://github.com/ng-bootstrap/ng-bootstrap/issues/661)
* **alert:** self-closing alerts are non-dismissible by default ([720c409](https://github.com/ng-bootstrap/ng-bootstrap/commit/720c409)), closes [#660](https://github.com/ng-bootstrap/ng-bootstrap/issues/660) [#676](https://github.com/ng-bootstrap/ng-bootstrap/issues/676)
* **carousel:** add config service to provide default values ([99d4386](https://github.com/ng-bootstrap/ng-bootstrap/commit/99d4386)), closes [#664](https://github.com/ng-bootstrap/ng-bootstrap/issues/664)
* **datepicker:** add config service to provide default values ([42002d9](https://github.com/ng-bootstrap/ng-bootstrap/commit/42002d9)), closes [#677](https://github.com/ng-bootstrap/ng-bootstrap/issues/677)
* **datepicker:** initial version of datepicker component ([#618](https://github.com/ng-bootstrap/ng-bootstrap/issues/618)) ([9e8c5c0](https://github.com/ng-bootstrap/ng-bootstrap/commit/9e8c5c0)), closes [#20](https://github.com/ng-bootstrap/ng-bootstrap/issues/20)
* **dropdown:** add config service to provide default values ([e97d260](https://github.com/ng-bootstrap/ng-bootstrap/commit/e97d260)), closes [#688](https://github.com/ng-bootstrap/ng-bootstrap/issues/688)
* **dropdown:** add support for dropup ([56b8dc5](https://github.com/ng-bootstrap/ng-bootstrap/commit/56b8dc5)), closes [#667](https://github.com/ng-bootstrap/ng-bootstrap/issues/667)
* **pagination:** add config service to provide default values ([#665](https://github.com/ng-bootstrap/ng-bootstrap/issues/665)) ([9405e0e](https://github.com/ng-bootstrap/ng-bootstrap/commit/9405e0e))
* **popover:** add config service to provide default values ([a58588c](https://github.com/ng-bootstrap/ng-bootstrap/commit/a58588c)), closes [#686](https://github.com/ng-bootstrap/ng-bootstrap/issues/686)
* **progressbar:** add config service to provide default values ([f32f8c8](https://github.com/ng-bootstrap/ng-bootstrap/commit/f32f8c8))
* **rating:** add config service to provide default values ([8b7047d](https://github.com/ng-bootstrap/ng-bootstrap/commit/8b7047d)), closes [#671](https://github.com/ng-bootstrap/ng-bootstrap/issues/671)
* **tabset:** add config service to provide default values ([609cbde](https://github.com/ng-bootstrap/ng-bootstrap/commit/609cbde)), closes [#673](https://github.com/ng-bootstrap/ng-bootstrap/issues/673)
* **timepicker:** add config service to provide default values ([ca40f27](https://github.com/ng-bootstrap/ng-bootstrap/commit/ca40f27)), closes [#674](https://github.com/ng-bootstrap/ng-bootstrap/issues/674)
* **tooltip:** add config service to provide default values ([7107caf](https://github.com/ng-bootstrap/ng-bootstrap/commit/7107caf)), closes [#678](https://github.com/ng-bootstrap/ng-bootstrap/issues/678)
* **typeahead:** add support for the showHint option ([5a0226d](https://github.com/ng-bootstrap/ng-bootstrap/commit/5a0226d)), closes [#639](https://github.com/ng-bootstrap/ng-bootstrap/issues/639) [#640](https://github.com/ng-bootstrap/ng-bootstrap/issues/640)



<a name="1.0.0-alpha.3"></a>
# [1.0.0-alpha.3](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.2...1.0.0-alpha.3) (2016-08-30)

This release adds support for the modal service. Cross-browser compatibility was reviewed and improved. We now support all the browsers supported by Angular 2 and Bootstrap, including IE9.
There are also small features and bug fixes for the existing widgets - see the details below. 

### Bug Fixes

* **typeahead:** cleans up subscription on component destroy ([5dcecae](https://github.com/ng-bootstrap/ng-bootstrap/commit/5dcecae)), closes [#620](https://github.com/ng-bootstrap/ng-bootstrap/issues/620)
* fix the error emitted by TS due to missing generic type ([976ff34](https://github.com/ng-bootstrap/ng-bootstrap/commit/976ff34)), closes [#622](https://github.com/ng-bootstrap/ng-bootstrap/issues/622)

### Features

* support IE9 ([5514a97](https://github.com/ng-bootstrap/ng-bootstrap/commit/5514a97)), closes [#604](https://github.com/ng-bootstrap/ng-bootstrap/issues/604)
* **modal:** add initial version of the modal service ([3ef99c5](https://github.com/ng-bootstrap/ng-bootstrap/commit/3ef99c5)), closes [#3](https://github.com/ng-bootstrap/ng-bootstrap/issues/3)
* **typeahead:** add support for the 'select' output ([c0dd7b7](https://github.com/ng-bootstrap/ng-bootstrap/commit/c0dd7b7)), closes [#606](https://github.com/ng-bootstrap/ng-bootstrap/issues/606) [#610](https://github.com/ng-bootstrap/ng-bootstrap/issues/610)



<a name="1.0.0-alpha.2"></a>
# [1.0.0-alpha.2](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.1...1.0.0-alpha.2) (2016-08-10)

This release makes the code compatible with Angular 2.0.0-rc.5.  
There are also small features and bug fixes for the existing widgets - see the details below.

### Bug Fixes

* **buttons:** don't interfere with 'active' class ([af4de2a](https://github.com/ng-bootstrap/ng-bootstrap/commit/af4de2a)), closes [#557](https://github.com/ng-bootstrap/ng-bootstrap/issues/557) [#559](https://github.com/ng-bootstrap/ng-bootstrap/issues/559)
* **progressbar:** reorder 'value' and 'max' attribute bindings for IE ([30e20f5](https://github.com/ng-bootstrap/ng-bootstrap/commit/30e20f5)), closes [#543](https://github.com/ng-bootstrap/ng-bootstrap/issues/543) [#544](https://github.com/ng-bootstrap/ng-bootstrap/issues/544)
* **timepicker:** format input values on blur ([d9ac911](https://github.com/ng-bootstrap/ng-bootstrap/commit/d9ac911)), closes [#511](https://github.com/ng-bootstrap/ng-bootstrap/issues/511) [#517](https://github.com/ng-bootstrap/ng-bootstrap/issues/517)
* **timepicker:** propagate only valid model values ([8c4144a](https://github.com/ng-bootstrap/ng-bootstrap/commit/8c4144a)), closes [#513](https://github.com/ng-bootstrap/ng-bootstrap/issues/513) [#516](https://github.com/ng-bootstrap/ng-bootstrap/issues/516)
* **typeahead:** resolves window items excessive rendering ([862fbc5](https://github.com/ng-bootstrap/ng-bootstrap/commit/862fbc5)), closes [#526](https://github.com/ng-bootstrap/ng-bootstrap/issues/526)
* **typeahead:** specify any type for formatters argument ([86c3644](https://github.com/ng-bootstrap/ng-bootstrap/commit/86c3644)), closes [#553](https://github.com/ng-bootstrap/ng-bootstrap/issues/553) [#554](https://github.com/ng-bootstrap/ng-bootstrap/issues/554)
* don't accept string as boolean input ([190b7ec](https://github.com/ng-bootstrap/ng-bootstrap/commit/190b7ec)), closes [#552](https://github.com/ng-bootstrap/ng-bootstrap/issues/552)
* don't accept string as number input ([f49fb08](https://github.com/ng-bootstrap/ng-bootstrap/commit/f49fb08)), closes [#560](https://github.com/ng-bootstrap/ng-bootstrap/issues/560)

### Features

* **timepicker:** allow hiding the spinners ([dc4962d](https://github.com/ng-bootstrap/ng-bootstrap/commit/dc4962d)), closes [#510](https://github.com/ng-bootstrap/ng-bootstrap/issues/510) [#519](https://github.com/ng-bootstrap/ng-bootstrap/issues/519)
* **typeahead:** set autocomplete, autocapitalize and autocorrect off ([46024c3](https://github.com/ng-bootstrap/ng-bootstrap/commit/46024c3)), closes [#520](https://github.com/ng-bootstrap/ng-bootstrap/issues/520) [#525](https://github.com/ng-bootstrap/ng-bootstrap/issues/525)


### BREAKING CHANGES

* number inputs in pagination could previously be set as strings. The values passed were transformed to numbers if necessary and rounded to integers. This is not supported anymore. All number inputs should now consistently be set as number, using the syntax `[attr]="value"` (for example: `<ngb-pagination [pageSize]="20" ...></ngb-pagination>` instead of `<ngb-pagination pageSize="20" ...></ngb-pagination>`), and rounding is not applied anymore.
* boolean inputs in progressbar and pagination could be set by just adding the attribute
(for example: `<ngb-progressbar striped></ngb-progressbar>`). This is not supported anymore.
All boolean inputs must now consistently be set using the syntax `[attr]="value"`
(for example: `<ngb-progressbar [striped]="true"></ngb-progressbar>`).
* you need to use `@NgModule`s to setup your application. Check https://ng-bootstrap.github.io/#/getting-started for more details.



<a name="1.0.0-alpha.1"></a>
# [1.0.0-alpha.1](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.0...1.0.0-alpha.1) (2016-07-29)

This release adds support for 2 new directives ([timepicker](https://ng-bootstrap.github.io/#/components/timepicker) and [typeahead](https://ng-bootstrap.github.io/#/components/typeahead)) and updates Bootstrap support to 4.0.0-alpha.3.
There are also small features and bug fixes for the existing widgets - see the details below.

### Bug Fixes

* **dropdown:** use button elements instead of links ([aeeee01](https://github.com/ng-bootstrap/ng-bootstrap/commit/aeeee01)), closes [#490](https://github.com/ng-bootstrap/ng-bootstrap/issues/490)
* **pagination:** display proper cursor on each page ([dca96fd](https://github.com/ng-bootstrap/ng-bootstrap/commit/dca96fd)), closes [#492](https://github.com/ng-bootstrap/ng-bootstrap/issues/492)
* **progressbar:** don't add bogus CSS classes ([56ea4c5](https://github.com/ng-bootstrap/ng-bootstrap/commit/56ea4c5)), closes [#496](https://github.com/ng-bootstrap/ng-bootstrap/issues/496)
* **rating:** set cursor on stars of rating component ([#411](https://github.com/ng-bootstrap/ng-bootstrap/issues/411)) ([bcba259](https://github.com/ng-bootstrap/ng-bootstrap/commit/bcba259))


### Features

* **accordion:** add panels type option ([b5ad117](https://github.com/ng-bootstrap/ng-bootstrap/commit/b5ad117)), closes [#420](https://github.com/ng-bootstrap/ng-bootstrap/issues/420) [#431](https://github.com/ng-bootstrap/ng-bootstrap/issues/431)
* **timepicker:** add timepicker widget
* **typeahead:** add typeahead widget

### BREAKING CHANGES

* **accordion:** accordion implementation was overhauled to use cards instead of deprecated panels. Refer to the API docs and [demo page](https://ng-bootstrap.github.io/#/components/accordion) for more details.  
* **pager:** support for the pager widget was removed as the result of its removal from Bootstrap's CSS.  


<a name="1.0.0-alpha.0"></a>
# [1.0.0-alpha.0](https://github.com/ng-bootstrap/ng-bootstrap/compare/9f8f37b...1.0.0-alpha.0) (2016-07-08)

### Features

Initial release with the following directives:

* accordion
* alert
* buttons
* carousel
* collapse
* dropdown
* pager
* pagination
* popover
* progressbar
* rating
* tabset
* tooltip
