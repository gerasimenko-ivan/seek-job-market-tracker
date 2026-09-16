import { expect, test } from '@playwright/test';
import { searchJobs } from "../src/search-jobs";

test('SEEK job search returns results', async ({ page }) => {
    await searchJobs({ page, keywords: ['qa', 'automation'], location: 'All Auckland' });

    // assertions
    await expect(page).toHaveURL(/qa-automation-jobs/);

    console.log(`URL: ${page.url()}`);
    console.log(
        'Keywords input:',
        await page.locator('[data-automation="searchKeywordsField"] input').inputValue()
    );
    console.log(
        'Where input:',
        await page.locator('input[data-automation="SearchBar__Where"]').inputValue()
    );

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