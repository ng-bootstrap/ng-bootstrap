import { NgModule } from '@angular/core';

import {
	NgbPagination,
	NgbPaginationEllipsis,
	NgbPaginationFirst,
	NgbPaginationLast,
	NgbPaginationNext,
	NgbPaginationNumber,
	NgbPaginationPrevious,
	NgbPaginationPages,
} from './pagination';

export {
	NgbPagination,
	NgbPaginationEllipsis,
	NgbPaginationFirst,
	NgbPaginationLast,
	NgbPaginationNext,
	NgbPaginationNumber,
	NgbPaginationPrevious,
	NgbPaginationPages,
} from './pagination';
export { NgbPaginationConfig } from './pagination-config';

const NGB_PAGINATION_DIRECTIVES = [
	NgbPagination,
	NgbPaginationEllipsis,
	NgbPaginationFirst,
	NgbPaginationLast,
	NgbPaginationNext,
	NgbPaginationNumber,
	NgbPaginationPrevious,
	NgbPaginationPages,
];

@NgModule({
	imports: NGB_PAGINATION_DIRECTIVES,
	exports: NGB_PAGINATION_DIRECTIVES,
})
export class NgbPaginationModule {}
