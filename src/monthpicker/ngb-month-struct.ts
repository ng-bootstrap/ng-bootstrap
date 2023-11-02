/**
 * An interface of the month model used by the monthpicker.
 *
 * All monthpicker APIs consume `NgbMonthStruct`, but return `NgbMonth`.
 *
 * See the [date format overview](#/components/monthpicker/overview#date-model) for more details.
 */
export interface NgbMonthStruct {
	/**
	 * The year, for example 2016
	 */
	year: number;

	/**
	 * The month, for example 1=Jan ... 12=Dec
	 */
	month: number;
}
