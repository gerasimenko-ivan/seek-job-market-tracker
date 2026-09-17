import { expect, test } from '@playwright/test';
import { JOB_TYPE, searchJobs } from '../src/search-jobs';
import { getSearchPageState } from '../src/search-page-state';
import { parseJobsCount } from '../src/parse-jobs-count';

test('SEEK job search returns results', async ({ page }) => {
    const searches = [
        {
            keywords: ['typescript'],
            location: 'All Auckland',
            type: JOB_TYPE.FULL_TIME,
        },
        {
            keywords: ['playwright'],
            location: 'All Auckland',
            type: JOB_TYPE.FULL_TIME,
        },
        {
            keywords: ['typescript', 'playwright'],
            location: 'All Auckland',
            type: JOB_TYPE.FULL_TIME,
        },
        {
            keywords: ['qa', 'automation'],
            location: 'All Auckland',
            type: JOB_TYPE.FULL_TIME,
        },
    ];

    for (const search of searches) {
        await searchJobs({
            page,
            keywords: search.keywords,
            location: search.location,
            type: search.type,
        });

        const urlSubfolder = `${search.keywords.join('-')}-jobs`;

        await expect(page).toHaveURL(new RegExp(urlSubfolder));

        const searchPageState = await getSearchPageState({
            page,
            printLogs: true,
        });

        const totalJobs = parseJobsCount(searchPageState.totalJobsMessage);

        expect(
            `${totalJobs.toLocaleString('en-NZ')} job${totalJobs === 1 ? '' : 's'}`,
        ).toBe(searchPageState.totalJobsMessage);

        console.log('--------------');
    }
});