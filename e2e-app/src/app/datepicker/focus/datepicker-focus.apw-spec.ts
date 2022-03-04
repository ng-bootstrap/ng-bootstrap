import {test, setPage, Key} from "../../../../apwBaseTest";

test.use({testURL: 'datepicker/focus', testSelector: 'h3:text("Datepicker focus")'});
test.beforeEach(async({page}) => setPage(page));

test.describe("Datepicker", () => {
  test("should be accessible", async({page, vmKeyboard, vmMouse, screenReader}) => {
    const input = await page.$("input.form-control");
    await vmMouse.click(0, 0, {origin: input});
    await screenReader.waitForMessage("my date");
    await vmKeyboard.type("2020-04-06");
    await vmKeyboard.press(Key.Tab);
    await screenReader.waitForMessage("Toggle");
    await vmKeyboard.press(Key.Space);
    await screenReader.waitForMessage("Monday, April 6, 2020");
    await vmKeyboard.press(Key.ArrowDown);
    await screenReader.waitForMessage("Monday, April 13, 2020");
    await vmKeyboard.press(Key.ArrowRight);
    await screenReader.waitForMessage("Tuesday, April 14, 2020");
    await vmKeyboard.press(Key.Space);
    await screenReader.waitForMessage("Toggle");
    await vmKeyboard.press(`${Key.ShiftLeft}+${Key.Tab}`);
    await screenReader.waitForMessage("2020 04 14");
  });
});
