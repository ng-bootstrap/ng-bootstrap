import {openUrl} from '../../tools.po';

import {TimepickerFilterPage} from './timepicker-filter.po';

describe('Timepicker', () => {
  let page: TimepickerFilterPage;

  beforeAll(() => page = new TimepickerFilterPage());
  beforeEach(async() => await openUrl('timepicker/filter'));

  async function expectValue(expectedValue) {
    const inputs = page.getFields();

    const values = [];
    for (let i = 0; i < inputs.length; i++) {
      values[i] = await inputs[i].getAttribute('value');
    }
    expect(values.join(':')).toBe(expectedValue);
  }

  describe('filter', async() => {
    it(`should accept numbers`, async() => {
      await expectValue('::');  // No starting values

      const inputs = page.getFields();
      await inputs[0].sendKeys('1');
      await inputs[1].sendKeys('2');
      await inputs[2].sendKeys('3');

      await inputs[0].click();
      await expectValue('01:02:03');
    });

    it(`shouldn't accept alpha`, async() => {
      await expectValue('::');  // No starting values

      const inputs = page.getFields();
      await inputs[0].sendKeys('A');
      await inputs[1].sendKeys('A');
      await inputs[2].sendKeys('A');

      await inputs[0].click();
      await expectValue('::');
    });
  });
});
