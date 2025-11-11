import { test } from '../../test-options';


test('paramentrized method test', async ({ pageManager }) => {
    const { faker } = await import('@faker-js/faker');
    const randomFullName = faker.person.fullName();

    await pageManager.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption('test@example.com', 'Welcome@123', 'Option 2');
    await pageManager.onFormLayoutsPage().submitInlineFormWithCredentialsAndCheckBox(randomFullName, 'john@example.com', true);
});

