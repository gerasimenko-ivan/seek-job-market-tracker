import { expect, test } from '@playwright/test';
import { searchJobs } from '../src/search-jobs';
import { getSearchPageState } from '../src/search-page-state';
import { parseJobsCount } from '../src/parse-jobs-count';

test('SEEK job search returns results', async ({ page }) => {
    await searchJobs({ page, keywords: ['qa', 'automation'], location: 'All Auckland' });

    // assertions
    await expect(page).toHaveURL(/qa-automation-jobs/);

    const searchPageState = await getSearchPageState({ page, printLogs: true });

    const totalJobs = parseJobsCount(searchPageState.totalJobsMessage);

    expect(`${totalJobs.toLocaleString('en-NZ')} jobs`).toBe(searchPageState.totalJobsMessage);
});