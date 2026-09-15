import { test, expect } from '@playwright/test';

test('SEEK job search returns results', async ({ page }) => {
    await page.goto('https://www.seek.co.nz/jobs', {
        waitUntil: 'domcontentloaded'
    });

    await page
        .locator('[data-automation="searchKeywordsField"] input')
        .fill('qa automation');

    await page
        .locator('input[data-automation="SearchBar__Where"]')
        .fill('Auckland');

    await page
        .locator('button[data-automation="searchButton"]')
        .click();

    await expect(page).toHaveURL(/qa-automation-jobs/);

    const totalJobsMessage =
        await page.locator('[data-automation="totalJobsMessage"]').textContent();

    console.log(`Total Jobs Message: ${totalJobsMessage}`);

    if (totalJobsMessage === null) {
        throw new Error('Total jobs message was not found');
    }

    const totalJobs = parseInt(totalJobsMessage.replace(/,/g, ''), 10);

    console.log(`Total Jobs: ${totalJobs}`);

    expect(`${totalJobs.toLocaleString('en-NZ')} jobs`).toBe(totalJobsMessage);
});