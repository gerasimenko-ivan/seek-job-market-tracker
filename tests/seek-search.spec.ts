import { expect, test } from '@playwright/test';
import { searchJobs } from '../src/search-jobs';
import { getSearchPageState } from '../src/search-page-state';
import { parseJobsCount } from '../src/parse-jobs-count';

test('SEEK job search returns results', async ({ page }) => {
    const searches = [
        {
            keywords: ['typescript'],
            location: 'All Auckland',
        },
        {
            keywords: ['playwright'],
            location: 'All Auckland',
        },
        {
            keywords: ['typescript', 'playwright'],
            location: 'All Auckland',
        },
        {
            keywords: ['qa', 'automation'],
            location: 'All Auckland',
        },
    ];

    for (const search of searches) {
        await searchJobs({
            page,
            keywords: search.keywords,
            location: search.location,
        });

        const urlSubfolder = `${search.keywords.join('-')}-jobs`;

        await expect(page).toHaveURL(new RegExp(urlSubfolder));

        const searchPageState = await getSearchPageState({
            page,
            printLogs: true,
        });

        const totalJobs = parseJobsCount(searchPageState.totalJobsMessage);

        expect(`${totalJobs.toLocaleString('en-NZ')} jobs`)
            .toBe(searchPageState.totalJobsMessage);

        console.log('--------------');
    }
});