import * as fs from 'fs';
import * as path from 'path';
import {browserName, test, page, launchOptions} from './playwright.conf';

beforeAll(async() => {
  Error.stackTraceLimit = Infinity;
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
  try {
    console.log(`Launch browser ${browserName} with`, launchOptions);
    await test.newPage();
  } catch (e) {
    console.error('Unable to setup a new page with playwright', e);
  }
});

afterAll(async() => {
  if (browserName === 'chromium') {
    try {
      console.log('Retrieving coverage...');
      const coverage: string = await page().evaluate('JSON.stringify(window.__coverage__);');
      if (coverage) {
        console.log(`Coverage retrieved (${coverage.length} bytes)`);
        fs.mkdirSync(path.join(__dirname, '..', '.nyc_output'));
        fs.writeFileSync(path.join(__dirname, '..', '.nyc_output', 'out.json'), coverage);
        const NYC = require('nyc');
        const nycInstance = new NYC(
            {cwd: path.join(__dirname, '..'), reportDir: `coverage-e2e`, reporter: ['lcov', 'json', 'text-summary']});
        nycInstance.report();
        nycInstance.cleanup();
        console.log('Coverage saved successfully!');
      } else {
        console.log('No coverage data!');
      }
    } catch (error) {
      console.log('Error in onComplete:', error);
      process.exit(1);
    }
  }
  await test.destroy();
}, 120000);
