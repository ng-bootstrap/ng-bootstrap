import {NGB_ACCORDION_DIRECTIVES} from './accordion/accordion';
import {NGB_ALERT_DIRECTIVES, NgbAlert} from './alert/alert';
import {NGB_CAROUSEL_DIRECTIVES} from './carousel/carousel';
import {NGB_COLLAPSE_DIRECTIVES} from './collapse/collapse';
import {NGB_DROPDOWN_DIRECTIVES} from './dropdown/dropdown';
import {NGB_PAGER_DIRECTIVES} from './pager/pager';
import {NGB_PAGINATION_DIRECTIVES} from './pagination/pagination';
import {NGB_PROGRESSBAR_DIRECTIVES} from './progressbar/progressbar';
import {NGB_RATING_DIRECTIVES} from './rating/rating';
import {NGB_TABSET_DIRECTIVES} from './tabset/tabset';
import {NGB_TOOLTIP_DIRECTIVES, NgbTooltipWindow} from './tooltip/tooltip';
import {NGB_POPOVER_DIRECTIVES, NgbPopoverWindow} from './popover/popover';
import {NGB_RADIO_DIRECTIVES} from './buttons/radio';

export {NgbAccordion, NgbPanel, NGB_ACCORDION_DIRECTIVES} from './accordion/accordion';
export {NgbAlert, NgbDismissibleAlert, NGB_ALERT_DIRECTIVES} from './alert/alert';
export {NgbCarousel, NgbSlide} from './carousel/carousel';
export {NgbCollapse} from './collapse/collapse';
export {NgbDropdown, NgbDropdownToggle, NGB_DROPDOWN_DIRECTIVES} from './dropdown/dropdown';
export {NgbPager, NGB_PAGER_DIRECTIVES} from './pager/pager';
export {NgbPagination, NGB_PAGINATION_DIRECTIVES} from './pagination/pagination';
export {NgbProgressbar, NGB_PROGRESSBAR_DIRECTIVES} from './progressbar/progressbar';
export {NgbRating, NGB_RATING_DIRECTIVES} from './rating/rating';
export {NgbTabset, NgbTab, NgbTabContent, NgbTabTitle, NgbTabChangeEvent, NGB_TABSET_DIRECTIVES} from './tabset/tabset';
export {NgbTooltip, NgbTooltipWindow, NGB_TOOLTIP_DIRECTIVES} from './tooltip/tooltip';
export {NgbPopover, NgbPopoverWindow, NGB_POPOVER_DIRECTIVES} from './popover/popover';
export {NgbRadioGroup, NgbRadioLabel, NgbRadio, NGB_RADIO_DIRECTIVES} from './buttons/radio';

export const NGB_DIRECTIVES = [
  NGB_ACCORDION_DIRECTIVES, NGB_ALERT_DIRECTIVES, NGB_CAROUSEL_DIRECTIVES, NGB_COLLAPSE_DIRECTIVES,
  NGB_DROPDOWN_DIRECTIVES, NGB_PAGER_DIRECTIVES, NGB_PAGINATION_DIRECTIVES, NGB_PROGRESSBAR_DIRECTIVES,
  NGB_RATING_DIRECTIVES, NGB_TABSET_DIRECTIVES, NGB_TOOLTIP_DIRECTIVES, NGB_POPOVER_DIRECTIVES, NGB_RADIO_DIRECTIVES
];

export const NGB_PRECOMPILE = [NgbAlert, NgbPopoverWindow, NgbTooltipWindow];
