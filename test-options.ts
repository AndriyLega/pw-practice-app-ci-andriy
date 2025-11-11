import { test as base } from '@playwright/test';
import { PageManager } from './e2e-tests/e2e/src/pageManager';

export type TestOptions = {
    globalsQaUrl: string;
    formLayoutsPage: string;
    pageManager: PageManager;
}

export const test = base.extend<TestOptions>({
    globalsQaUrl: ['', { option: true }],

    formLayoutsPage: async ({ page }, use) => {
        await page.goto('/');
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click(); // everything thet before use() is run before the test
        await use(''); 
        console.log('Teardown formLayoutsPage'); // everything that after use() is run after the test
    }, // fixture is run before the test beforeAll hook as environment preparation, auto: true means the fixture is run automatically before the test
    pageManager: async ({ page, formLayoutsPage }, use) => {
        const pageManager = new PageManager(page);
        await use(pageManager);
    },
});