import { test } from '@playwright/test';
import { PageManager } from './src/pageManager';
import { argosScreenshot } from "@argos-ci/playwright";

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test('navagate to form page @smoke @regression', async ({ page }) => {
    const pageManager = new PageManager(page);
    await pageManager.navigateTo().navigateToFormLayoutsPage();
    await pageManager.navigateTo().navigateToDatepickerPage();
    await pageManager.navigateTo().navigateToToastrPage();
    await pageManager.navigateTo().navigateToTooltipPage();
    await pageManager.navigateTo().navigateToSmartTablePage();
});

test('paramentrized method test @smoke', async ({ page }) => {
    const pageManager = new PageManager(page);
    const { faker } = await import('@faker-js/faker');
    const randomFullName = faker.person.fullName();


    await pageManager.navigateTo().navigateToFormLayoutsPage();
    await pageManager.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption('test@example.com', 'Welcome@123', 'Option 2');
    await pageManager.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption('test@example2.com', 'Welcome@1234', 'Option 1');
    await page.screenshot({ path: 'screenshot/formLayoutsPage.png' }); // entire page screenshot
    const buffer = await page.screenshot();
    console.log(buffer.toString('base64'));

    await pageManager.onFormLayoutsPage().submitInlineFormWithCredentialsAndCheckBox(randomFullName, 'john@example.com', true);
    await pageManager.onFormLayoutsPage().submitInlineFormWithCredentialsAndCheckBox(randomFullName, 'jane@example.com', false);
    await page.locator('nb-card', { hasText: 'Inline form' }).screenshot({ path: 'screenshot/inlineForm.png' }); // specific element screenshot
});


test('datepicker', async ({ page }) => {
    const pageManager = new PageManager(page);
    await pageManager.navigateTo().navigateToDatepickerPage();
    await pageManager.onDatePickerPage().selectCommonDatepickerDateFromToday(207);
    await pageManager.onDatePickerPage().selectDatepickerWithRangeFromToday(109, 110);
});

test.only('testing with argos ci', async ({ page }) => {
    const pageManager = new PageManager(page);
    await pageManager.navigateTo().navigateToFormLayoutsPage();
    await argosScreenshot(page, "form layouts page");
    await pageManager.navigateTo().navigateToDatepickerPage();
    await argosScreenshot(page, "datepicker page");
});
