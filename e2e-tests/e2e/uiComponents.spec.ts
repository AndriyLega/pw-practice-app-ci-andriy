import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test.describe('Form Layouts page @blok', () => {
    test.describe.configure({ retries: 0 });
    test.describe.configure({ mode: 'serial' });
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    });

    test('input fields', async ({ page }, testInfo) => {
        if (testInfo.retry > 0) {
            // do something
        }
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: 'Email' });
        await usingTheGridEmailInput.fill('test@example.com');
        await usingTheGridEmailInput.clear();
        await usingTheGridEmailInput.pressSequentially('test2@example.com');

        // generic assertions
        const inputValue = await usingTheGridEmailInput.inputValue();
        expect(inputValue).toEqual('test2@example.com');

        // locator assertions
        await expect(usingTheGridEmailInput).toHaveValue('test2@example.com');
    });

    test.only('radio buttons', async ({ page }) => {
        const usingTheGridForm = page.locator('nb-card', { hasText: 'Using the Grid' });

        await usingTheGridForm.getByLabel('Option 1').check({ force: true });
        await usingTheGridForm.getByRole('radio', { name: 'Option 2' }).check({ force: true });
        const radioStatusEqualTo = await usingTheGridForm.getByRole('radio', { name: 'Option 2' }).isChecked();
        // expect(radioStatusEqualTo).toBeTruthy();
        // await expect(usingTheGridForm.getByRole('radio', { name: 'Option 1' })).not.toBeChecked();
        await usingTheGridForm.getByRole('radio', { name: 'Option 1' }).check({ force: true });
        // visual assertions
        await expect(usingTheGridForm).toHaveScreenshot(); // use command in CLI: npx playwright test --update-snapshots to update the expected snapshots for all tests and projects.
        
    });

});

test.describe('Modal & Overlays page', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Modal & Overlays').click();
        await page.getByText('Toastr').click();
    });

    test('checkboxes', async ({ page }) => {
        // { force: true } is used to bypass the default validation for click, check behavior (i.e. if the checkbox is already checked, it will not be checked again, is element visible, etc.)
        await page.getByRole('checkbox', { name: 'Hide on click' }).click({ force: true }); // click will check or uncheck the checkbox
        await page.getByRole('checkbox', { name: 'Hide on click' }).check({ force: true }); // check will check the checkbox
        await page.getByRole('checkbox', { name: 'Hide on click' }).uncheck({ force: true }); // uncheck will uncheck the checkbox

        await page.getByRole('checkbox', { name: 'Prevent arising of duplicate toast' }).check({ force: true });

        // check/uncheck all checkboxes
        const allCheckboxes = page.getByRole('checkbox');
        for (const checkbox of await allCheckboxes.all()) {
            await checkbox.uncheck({ force: true });
            expect(await checkbox.isChecked()).toBeFalsy();
        }
    });
});

test.describe('Dashboard page', () => {

    test('list and dropdowns', async ({ page }) => {
        const dropdownMenu = page.locator('ngx-header nb-select')
        await dropdownMenu.click();

        page.getByRole('list') // when the list has the UL tag
        page.getByRole('listitem') // when the list has the LI tag as array of list items

        //const optionList = page.getByRole('list').locator('nb-option');
        const optionList = page.locator('nb-option-list nb-option');
        await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate']);
        await optionList.filter({ hasText: 'Cosmic' }).click();

        const header = page.locator('nb-layout-header');
        await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)');

        const colors = {
            'Light': 'rgb(255, 255, 255)',
            'Dark': 'rgb(34, 43, 69)',
            'Cosmic': 'rgb(50, 50, 89)',
            'Corporate': 'rgb(255, 255, 255)',
        }

        for (const colocr in colors) {
            await dropdownMenu.click();
            await optionList.filter({ hasText: colocr }).click();
            await expect(header).toHaveCSS('background-color', colors[colocr]);
        }
    });

    test('sliders', async ({ page }) => {
        // update the attribute value of the slider
        const temperatureSlider = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle');
        const temperatureValue = page.locator('[tabtitle="Temperature"] .temperature-bg .value');
        await temperatureSlider.evaluate(el => {
            el.setAttribute('cx', '232.630');
            el.setAttribute('cy', '232.630');
        });
        await temperatureSlider.click();
        await expect(temperatureValue).toHaveText('30');

        // mouse movement on the slider
        const temperatureBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger');
        await temperatureBox.scrollIntoViewIfNeeded();
        const box = await temperatureBox.boundingBox();
        const x = box.x + box.width / 2;
        const y = box.y + box.height / 2;
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x + 100, y);
        await page.mouse.move(x + 100, y + 100);
        await page.mouse.up();
        await expect(temperatureValue).toHaveText('30');
    });
});

test.describe('Modal & Overlays - Tooltip page', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Modal & Overlays').click();
        await page.getByText('Tooltip').click();
    });

    test('tooltips', async ({ page }) => {
        const tooltipCard = page.locator('nb-card', { hasText: 'Tooltip Placements' });
        await tooltipCard.getByRole('button', { name: 'Top' }).hover();

        page.getByRole('tooltip') // if you have a role tooltip created in the HTML, you can use this to get the tooltip
        const tooltip = await page.locator('nb-tooltip').textContent();
        expect(tooltip).toEqual('This is a tooltip');
    });
});

test.describe('Tables & Data - Smart Table page', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Tables & Data').click();
        await page.getByText('Smart Table').click();
    });

    test('browser native dialog box', async ({ page }) => {
        page.on('dialog', async (dialog) => { //this is a listener for the browser native dialog box. By default Playwright will always cencel the dialog box. But with this listener, we can accept the dialog box.
            expect(dialog.message()).toEqual('Are you sure you want to delete?');
            await dialog.accept();
        });

        const deleteIcon = page.getByRole('table').locator('tr', { hasText: 'mdo@gmail.com' }).locator('.nb-trash');
        await deleteIcon.click();
        await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com');

    });

    test('web tables', async ({ page }) => {
        // get the row by any text in this row
        const row = page.getByRole('row', { name: 'twitter@outlook.com' })
        await row.locator('.nb-edit').click();

        const ageInput = page.locator('input-editor').getByPlaceholder('Age');
        await ageInput.clear();
        await ageInput.fill('35');
        await page.locator('.nb-checkmark').click();

        // get the row based on the value in the specific column
        await page.locator('.ng2-smart-pagination-nav').getByText('2').click();
        const secondRow = page.getByRole('row', { name: '11' }).filter({ has: page.locator('td').nth(1).getByText('11') })
        await secondRow.locator('.nb-edit').click();
        const emailInput = page.locator('input-editor').getByPlaceholder('E-mail');
        await emailInput.clear();
        await emailInput.fill('test@example.com');
        await page.locator('.nb-checkmark').click();
        await expect(secondRow.locator('td').nth(5)).toHaveText('test@example.com');

        // test filter of the table

        const ages = ['20', '30', '40', '200'];

        for (const age of ages) {
            const ageFilterInput = page.locator('input-filter').getByPlaceholder('Age');
            await ageFilterInput.fill(age);
            await page.waitForTimeout(500);

            const filteredRows = page.locator('tbody .ng2-smart-row');
            if (await filteredRows.count() == 0) {
                expect(await page.locator('tbody').textContent()).toEqual(' No data found ');
            } else {
                for (const row of await filteredRows.all()) {
                    const ageCell = await row.locator('td').last().textContent();
                    expect(ageCell).toEqual(age);
                }
            }
        }
    });
});

test.describe('Forms - Datepicker page', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click();
        await page.getByText('Datepicker').click();
    });

    test('datepicker', async ({ page }) => {
        const datepickerInput = page.getByPlaceholder('Form Picker');
        await datepickerInput.click();

        const currentMonthDays = page.locator('nb-calendar-picker').locator('[class="day-cell ng-star-inserted"], .today');
        const targetDay = currentMonthDays.getByText('31', { exact: true });
        await targetDay.click();
        await expect(datepickerInput).toHaveValue('Oct 31, 2025');
    });

    test('datepicker with the date object', async ({ page }) => {
        const datepickerInput = page.getByPlaceholder('Form Picker');
        await datepickerInput.click();

        let date = new Date();
        date.setDate(date.getDate() + 37);
        const dayString = date.getDate().toString();
        const expectedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const expectedMonthAndYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        let currentMonthAndYear = await page.locator('nb-card-header nb-calendar-view-mode button').textContent();
        const nextMonthButton = page.locator('nb-card-header nb-calendar-pageable-navigation .next-month');

        while (!currentMonthAndYear.includes(expectedMonthAndYear)) {
            await nextMonthButton.click();
            currentMonthAndYear = await page.locator('nb-card-header nb-calendar-view-mode button').textContent();
        }


        const currentMonthDays = page.locator('nb-calendar-picker').locator('[class="day-cell ng-star-inserted"], .today');
        const targetDay = currentMonthDays.getByText(dayString, { exact: true });
        await targetDay.click();
        await expect(datepickerInput).toHaveValue(expectedDate);
    });
});
