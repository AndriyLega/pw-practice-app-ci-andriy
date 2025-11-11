import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
    await page.goto(process.env.URL);
    await page.getByText('Button Triggering AJAX Request').click();
    testInfo.setTimeout(testInfo.timeout + 2000); // add 2 seconds to the timeout for all tests in this suite
});

test('Automatic waiting', async ({ page }) => {
    const successMessage = page.locator('.bg-success');

    //await successMessage.click()

    //const text = await successMessage.textContent();

    // await successMessage.waitFor({ state: 'attached' });
    // const allTextContents = await successMessage.allTextContents();

    //expect(allTextContents).toContain('Data loaded with AJAX get request.');

    await expect(successMessage).toHaveText('Data loaded with AJAX get request.', { timeout: 20000 });
});

test.skip('Alternative waiting', async ({ page }) => {
    const successMessage = page.locator('.bg-success');

    //  wait for element
    //await page.waitForSelector('.bg-success');

    // wait for particular response
    //await page.waitForResponse('http://www.uitestingplayground.com/ajaxdata')

    // wait for network calls to be completed (not recommended)
    await page.waitForLoadState('networkidle');

    const allTextContents = await successMessage.allTextContents();
    expect(allTextContents).toContain('Data loaded with AJAX get request.');
});

test.skip('timeouts', async ({ page }) => {
    //test.setTimeout(10000);
    test.slow();
    const successMessage = page.locator('.bg-success');
    await successMessage.click();
});
