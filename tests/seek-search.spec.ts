import { expect, test } from '@playwright/test';
import { getSearchPageState } from '../src/search-page-state';
import { parseJobsCount } from '../src/parse-jobs-count';
import { JOB_TYPE, SearchParams, SeekSearchPage } from '../src/pages/seek-search-page';

test('SEEK job search returns results', async ({ page }) => {
    const searches: SearchParams[] = [
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

    const seekSearch = new SeekSearchPage(page);

    for (const search of searches) {
        await seekSearch.search(search);

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