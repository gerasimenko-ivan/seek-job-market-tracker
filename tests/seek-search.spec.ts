import { test, expect } from '@playwright/test';

test('SEEK job search returns results', async ({ page }) => {
    await page.goto('https://www.seek.co.nz/', {
        waitUntil: 'domcontentloaded'
    });

    await page.locator('input[name="keywords"]').fill('qa automation');
    await page.getByRole('button', { name: /search/i }).click();

    await expect(page).toHaveURL(/qa-automation-jobs/);

    console.log('SEEK search page loaded');
});