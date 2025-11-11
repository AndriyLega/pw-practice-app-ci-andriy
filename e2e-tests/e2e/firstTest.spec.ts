import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
});

test('Locators syntax rules', async ({ page }) => {
    //by tag name
    await page.locator('input').first().click();

    //by id
    page.locator('#inputEmail1');

    //by class vale
    page.locator('.shape-rectangle');

    //by attribute
    page.locator('[placeholder="Email"]');

    //by Class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]');

    //by combining multiple locators
    page.locator('input[placeholder="Email"]');

    //by XPath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]');

    //by partial text match
    page.locator(':text("Using")');

    //by exact text match
    page.locator(':text-is("Using the Grid")');
});

test('User facing locators', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Email' }).first().click();
    await page.getByRole('button', { name: 'Sign in' }).first().click();

    await page.getByLabel('Email').first().click();

    await page.getByPlaceholder('Jane Doe').click();

    await page.getByText('Using the Grid').click();

    //await page.getByTitle('IoT Dashboard').click();

    await page.getByTestId('SignIn').click();
});

test('Locating child elements', async ({ page }) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click();
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click();

    await page.locator('nb-card').getByRole('button', { name: 'Sign in' }).first().click();

    await page.locator('nb-card').nth(3).getByRole('button').click();
});

test('Locating parent elements', async ({ page }) => {
    await page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: 'Email' }).click();
    await page.locator('nb-card', { has: page.locator('#inputEmail1') }).getByRole('textbox', { name: 'Email' }).click();

    await page.locator('nb-card').filter({ hasText: 'Basic form' }).getByRole('textbox', { name: 'Email' }).click();
    await page.locator('nb-card').filter({ has: page.locator('.status-danger') }).getByRole('textbox', { name: 'Password' }).click();

    await page.locator('nb-card').filter({ has: page.getByRole('checkbox') }).filter({ hasText: 'Sign in' }).getByRole('textbox', { name: 'Email' }).click();

    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', { name: 'Email' }).click();
});

test('Reusable locators', async ({ page }) => {
    const basicForm = page.locator('nb-card').filter({ hasText: 'Basic form' });
    const emailInput = basicForm.getByRole('textbox', { name: 'Email' });
    await emailInput.fill('test@example.com');
    await basicForm.getByRole('textbox', { name: 'Password' }).fill('Welcome@123');
    await basicForm.getByRole('checkbox').click();
    await basicForm.getByRole('button').click();

    await expect(emailInput).toHaveValue('test@example.com');
});

test('Extract values from elements', async ({ page }) => {
    // single text value
    const basicForm = page.locator('nb-card').filter({ hasText: 'Basic form' });
    const buttonText = await basicForm.locator('button').textContent();
    expect(buttonText).toEqual('Submit');

    // all text values
    const allRadioTexts = await page.locator('nb-radio').allTextContents();
    expect(allRadioTexts).toContain('Option 1');

    // input value
    const emailField = basicForm.getByRole('textbox', { name: 'Email' });
    await emailField.fill('test@example.com');
    const emailValue = await emailField.inputValue();
    expect(emailValue).toEqual('test@example.com');

    // attribute value
    const emailPlaceholder = await emailField.getAttribute('placeholder');
    expect(emailPlaceholder).toEqual('Email');
});

test('assertions', async ({ page }) => {
    const basicFormButton = page.locator('nb-card').filter({ hasText: 'Basic form' }).locator('button');
    // general assertions
    const value = 5;
    expect(value).toEqual(5);

    const buttonText = await basicFormButton.textContent();
    expect(buttonText).toEqual('Submit');

    // locator assertions
    await expect(basicFormButton).toHaveText('Submit');

    // soft assertions
    await expect.soft(basicFormButton).toHaveText('Submit');
    await basicFormButton.click();
});