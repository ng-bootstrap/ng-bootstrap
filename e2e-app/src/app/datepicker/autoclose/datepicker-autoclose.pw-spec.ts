import {page} from '.././../../../playwright/controller';
import {DatepickerAutoClosePage} from './datepicker-autoclose.pw-po';

describe('Datepicker Autoclose', () => {
  const po = new DatepickerAutoClosePage();
  const expectDatepickerToBeClosed = async(message: string) => {
    await page().waitForSelector(po.getDatepicker(), {state: 'detached'});
    expect(await page().innerText(po.getOpenStatus())).toEqual('closed');
  };

  for (let displayMonths of[1, 2]) {
    describe(`displayMonths = ${displayMonths}`, () => {

      beforeEach(async() => {
        await po.loadThePage();
        await po.selectDisplayMonths(displayMonths);
      });

      const DATE_SELECT = new Date(2018, 7, 1);
      const DATE_OUTSIDE_BEFORE = new Date(2018, 6, 31);
      const DATE_OUTSIDE_AFTER = displayMonths === 1 ? new Date(2018, 6, 31) : new Date(2018, 9, 1);

      it(`should not close when right clicking`, async() => {
        await po.selectAutoClose('true');
        await po.openDatepicker();
        await po.rightClickOnDay(DATE_SELECT);
        await po.expectDatepickerToBeOpen(`Datepicker should NOT be closed on right click inside`);
        await po.rightClickOutside();
        await po.expectDatepickerToBeOpen(`Datepicker should NOT be closed on right click outside`);
      });

      it(`should work when autoClose === true`, async() => {
        await po.selectAutoClose('true');

        // escape
        await po.openDatepicker();
        await page().keyboard.press('Escape');
        await expectDatepickerToBeClosed(`Datepicker should be closed on ESC`);

        // outside click
        await po.openDatepicker();
        await po.clickOutside();
        await expectDatepickerToBeClosed(`Datepicker should be closed on outside click`);

        // date selection
        await po.openDatepicker();
        await po.clickOnDay(DATE_SELECT);
        await expectDatepickerToBeClosed(`Datepicker should be closed on date selection`);

        // outside days click -> month before
        await po.openDatepicker();
        await po.clickOnDay(DATE_OUTSIDE_BEFORE);
        await expectDatepickerToBeClosed(`Datepicker should be closed on outside day click`);

        // outside days click -> month after
        await po.openDatepicker();
        await po.clickOnDay(DATE_OUTSIDE_AFTER);
        await expectDatepickerToBeClosed(`Datepicker should be closed on outside day click`);
      });
    });
  }
});
