import { expect, test } from '@playwright/test';
import { searchJobs } from '../src/search-jobs';
import { getSearchPageState } from '../src/search-page-state';

test('SEEK job search returns results', async ({ page }) => {
    await searchJobs({ page, keywords: ['qa', 'automation'], location: 'All Auckland' });

    // assertions
    await expect(page).toHaveURL(/qa-automation-jobs/);

    const searchPageState = await getSearchPageState({ page, printLogs: true });

    if (searchPageState.totalJobsMessage === null) {
        throw new Error('Total jobs message was not found');
    }

    const totalJobs = parseInt(searchPageState.totalJobsMessage.replace(/,/g, ''), 10);

    console.log(`Total Jobs: ${totalJobs}`);

    expect(`${totalJobs.toLocaleString('en-NZ')} jobs`).toBe(searchPageState.totalJobsMessage);
});