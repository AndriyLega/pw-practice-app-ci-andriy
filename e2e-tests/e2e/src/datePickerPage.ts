import { expect, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class DatePickerPage extends HelperBase {

    constructor(page: Page) {
        super(page);
    }

    async selectCommonDatepickerDateFromToday(numberOfDaysFromToday: number): Promise<void> {
        const datepickerInput = this.page.getByPlaceholder('Form Picker');
        await datepickerInput.click();
        const expectedDate = await this.selectDateInCalendar(numberOfDaysFromToday);
        await expect(datepickerInput).toHaveValue(expectedDate);
    }

    async selectDatepickerWithRangeFromToday(startDayFromToday: number, endDayFromToday: number): Promise<void> {
        const datepickerInput = this.page.getByPlaceholder('Range Picker');
        await datepickerInput.click();
        const expectedStartDate = await this.selectDateInCalendar(startDayFromToday);
        const expectedEndDate = await this.selectDateInCalendar(endDayFromToday);
        await expect(datepickerInput).toHaveValue(`${expectedStartDate} - ${expectedEndDate}`);
    }

    private async selectDateInCalendar(numberOfDaysFromToday: number): Promise<string> {
        let date = new Date();
        date.setDate(date.getDate() + numberOfDaysFromToday);
        const dayString = date.getDate().toString();
        const expectedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const expectedMonthAndYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        let currentMonthAndYear = await this.page.locator('nb-card-header nb-calendar-view-mode button').textContent();
        const nextMonthButton = this.page.locator('nb-card-header nb-calendar-pageable-navigation .next-month');

        while (!currentMonthAndYear.includes(expectedMonthAndYear)) {
            await nextMonthButton.click();
            currentMonthAndYear = await this.page.locator('nb-card-header nb-calendar-view-mode button').textContent();
        }

        const selectedMonthDays = this.page.locator('nb-calendar-picker').locator('[class="day-cell ng-star-inserted"], .today, [class="range-cell day-cell ng-star-inserted"]');
        const targetDay = selectedMonthDays.getByText(dayString, { exact: true });
        await targetDay.click();
        return expectedDate;
    }
}