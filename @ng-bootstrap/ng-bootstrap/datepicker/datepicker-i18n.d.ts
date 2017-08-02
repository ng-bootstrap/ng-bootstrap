/**
 * Type of the service supplying month and weekday names to to NgbDatepicker component.
 * See the i18n demo for how to extend this class and define a custom provider for i18n.
 */
export declare abstract class NgbDatepickerI18n {
    /**
     * Returns the short week day name to display in the heading of the month view.
     * With default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun
     */
    abstract getWeekdayName(weekday: number): string;
    /**
     * Returns the month name to display in the date picker navigation.
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec
     */
    abstract getMonthName(month: number): string;
}
export declare class NgbDatepickerI18nDefault extends NgbDatepickerI18n {
    getWeekdayName(weekday: number): string;
    getMonthName(month: number): string;
}
