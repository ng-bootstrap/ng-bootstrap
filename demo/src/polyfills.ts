import 'core-js/shim';
import 'classlist-polyfill';
require('zone.js/dist/zone');

if (process.env.ENV === 'build') {
  // Production

} else {
  // Development

  Error['stackTraceLimit'] = Infinity;

  require('zone.js/dist/long-stack-trace-zone');
}
