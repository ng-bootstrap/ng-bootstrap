import {NgbAlert} from './alert/alert';
import {NgbCollapse} from './collapse/collapse';
import {NgbAccordion, NgbPanel} from './accordion/accordion';
import {NgbDropdown, NgbDropdownToggle} from './dropdown/dropdown';
import {NgbPagination} from './pagination/pagination';
import {NgbProgressbar} from './progressbar/progressbar';
import {NgbRating} from './rating/rating';
import {NgbScrollSpier, NgbScrollSpy, NgbScrollTarget} from './scrollspy/scrollspy';
import {NgbTabset, NgbTab, NgbTabContent, NgbTabTitle} from './tabset/tabset';

export {NgbAccordion, NgbPanel} from './accordion/accordion';
export {NgbAlert} from './alert/alert';
export {NgbCollapse} from './collapse/collapse';
export {NgbDropdown, NgbDropdownToggle} from './dropdown/dropdown';
export {NgbPagination} from './pagination/pagination';
export {NgbProgressbar} from './progressbar/progressbar';
export {NgbRating} from './rating/rating';
export {NgbScrollSpier, NgbScrollSpy, NgbScrollTarget} from './scrollspy/scrollspy';
export {NgbTabset, NgbTab, NgbTabContent, NgbTabTitle} from './tabset/tabset';

export const NGB_DIRECTIVES = [
  NgbAccordion, NgbAlert, NgbCollapse, NgbPanel, NgbDropdown, NgbDropdownToggle, NgbPagination, NgbProgressbar,
  NgbRating, NgbScrollSpy, NgbScrollTarget, NgbTabset, NgbTab, NgbTabContent, NgbTabTitle
];

export const NGB_PROVIDERS = [NgbScrollSpier];
