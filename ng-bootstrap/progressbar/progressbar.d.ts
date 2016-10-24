import { NgbProgressbarConfig } from './progressbar-config';
/**
 * Directive that can be used to provide feedback on the progress of a workflow or an action.
 */
export declare class NgbProgressbar {
    /**
     * Maximal value to be displayed in the progressbar.
     */
    max: number;
    /**
     * A flag indicating if the stripes of the progress bar should be animated. Takes effect only for browsers
     * supporting CSS3 animations, and if striped is true.
     */
    animated: boolean;
    /**
     * A flag indicating if a progress bar should be displayed as striped.
     */
    striped: boolean;
    /**
     * Type of progress bar, can be one of "success", "info", "warning" or "danger".
     */
    type: string;
    /**
     * Current value to be displayed in the progressbar. Should be smaller or equal to "max" value.
     */
    value: number;
    constructor(config: NgbProgressbarConfig);
    getValue(): number;
    getPercentValue(): number;
}
