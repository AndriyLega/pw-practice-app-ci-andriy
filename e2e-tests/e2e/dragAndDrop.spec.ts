import { expect } from '@playwright/test';
import { test } from '../../test-options';

test.beforeEach(async ({ page, globalsQaUrl }) => {
    await page.goto(globalsQaUrl);
});

test('drag and drop with iframe', async ({ page }) => {
    const iframe = page.frameLocator('[rel-title="Photo Manager"] iframe');

    const firstImage = iframe.locator('li', { hasText: 'High Tatras 2' });
    await firstImage.dragTo(iframe.locator('#trash'));

    // more precices control of the drag and drop
    const secondImage = iframe.locator('li', { hasText: 'High Tatras 3' });
    await secondImage.hover();
    await page.mouse.down();
    await iframe.locator('#trash').hover();
    await page.mouse.up();

    await expect(iframe.locator('#trash li h5')).toHaveText(['High Tatras 2', 'High Tatras 3']);
});