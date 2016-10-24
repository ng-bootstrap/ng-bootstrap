import { OnChanges, SimpleChanges } from '@angular/core';
export declare class NgbHighlight implements OnChanges {
    parts: string[];
    highlightClass: string;
    result: string;
    term: string;
    ngOnChanges(changes: SimpleChanges): void;
}
