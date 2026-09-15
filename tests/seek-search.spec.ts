import { test, expect } from '@playwright/test';

test('SEEK job search returns results', async ({ page }) => {
    await page.goto('https://www.seek.co.nz/jobs', {
        waitUntil: 'domcontentloaded'
    });

    await page
        .locator('[data-automation="searchKeywordsField"] input')
        .fill('qa automation');

    await page
        .locator('button[data-automation="searchButton"]')
        .click();

    await expect(page).toHaveURL(/qa-automation-jobs/);

    console.log('SEEK search page loaded');
});