<a name="1.0.0-alpha.1"></a>
# [1.0.0-alpha.1](https://github.com/ng-bootstrap/ng-bootstrap/compare/1.0.0-alpha.0...v1.0.0-alpha.1) (2016-07-29)

This release adds supports for 2 new directives ([timepicker](https://ng-bootstrap.github.io/#/components/timepicker) and [typeahead](https://ng-bootstrap.github.io/#/components/typeahead)) and updates Bootstrap support to 4.0.0-alpha.3.
There are also small features and bug fixes for the existing widgets - see the details below.

### Bug Fixes

* **dropdown:** use button elements instead of links ([aeeee01](https://github.com/ng-bootstrap/ng-bootstrap/commit/aeeee01)), closes [#490](https://github.com/ng-bootstrap/ng-bootstrap/issues/490)
* **pagination:** display proper cusrsor on each page ([dca96fd](https://github.com/ng-bootstrap/ng-bootstrap/commit/dca96fd)), closes [#492](https://github.com/ng-bootstrap/ng-bootstrap/issues/492)
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