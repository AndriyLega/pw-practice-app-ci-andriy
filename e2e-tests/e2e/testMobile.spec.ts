import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test.describe('Form Layouts page @blok', () => {

    test.beforeEach(async ({ page }) => {

    });

    test('input fields', async ({ page }, testInfo) => {
        if(testInfo.project.name === 'mobile') {
            await page.locator('.sidebar-toggle').click();
        }
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
        if(testInfo.project.name === 'mobile') {
            await page.locator('.sidebar-toggle').click();
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

});
