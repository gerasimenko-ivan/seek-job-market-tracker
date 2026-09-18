import { test } from '@playwright/test';
import { SeekSearchPage } from '../src/pages/seek-search-page';
import { expectJobsCountMessage } from '../src/expects/expect-jobs-count';
import { expectSearchUrl } from '../src/expects/expect-search-url';
import { JOB_TYPE, SearchParams } from '../src/types/seek-search';

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

        expectSearchUrl({ page, search });

        const searchPageState = await seekSearch.getSearchState({
            printLogs: true,
        });

        expectJobsCountMessage(searchPageState);

        console.log('--------------');
    }
});