import { expect, test } from '@playwright/test';
import { JOB_TYPE, SearchParams, SeekSearchPage } from '../src/pages/seek-search-page';
import { expectJobsCountMessage } from '../src/expects/expect-jobs-count';

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

        const searchPageState = await seekSearch.getSearchState({
            printLogs: true,
        });

        expectJobsCountMessage(searchPageState);

        console.log('--------------');
    }
});