import {test as baseTest} from "assistive-playwright-test";
import {Fixtures, fixtures} from "./baseTest";
export {getPage, setPage} from "./baseTest";
export {Key} from "assistive-playwright-test";

export const test = baseTest.extend<Fixtures>({...fixtures, coverage: false});
