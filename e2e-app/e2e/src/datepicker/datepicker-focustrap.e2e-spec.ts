import { DatepickerFocustrapPage } from './datepicker-focustrap.po';

describe('Datepicker', () => {
  let page: DatepickerFocustrapPage;

  beforeEach(async () => {
    page = new DatepickerFocustrapPage();
    await page.navigateTo();
  });

  it('should be present on the page', async () => {
    const datepicker = await page.getDatepicker().getTagName();
    expect(datepicker).toEqual('ngb-datepicker');
  });
});
