import { test } from '@playwright/test';
import { SeekSearchPage } from '../src/pages/seek-search-page';
import { expectJobsCountMessage } from '../src/expects/expect-jobs-count';
import { expectSearchUrl } from '../src/expects/expect-search-url';
import {
    JOB_CATEGORY,
    JOB_ICT_SUBCATEGORY,
    JOB_TYPE,
    SALARY_HOURLY,
    SALARY_PERIOD,
    SearchParams
} from '../src/types/seek-search';
import { takeScreenshot } from '../src/utils/screenshot';

test('SEEK search collects QA job counts', async ({ page }) => {
    test.setTimeout(80000);
    const searches: SearchParams[] = [
        {
            keywords: ['typescript', 'playwright'],
            location: 'All Auckland',
            type: JOB_TYPE.FULL_TIME,
            classification: {
                category: JOB_CATEGORY.ICT,
                subcategory: JOB_ICT_SUBCATEGORY.TESTING_AND_QUALITY_ASSURANCE,
            },
            salary: {
                period: SALARY_PERIOD.HOURLY,
                from: SALARY_HOURLY.NZD_35,
            },
        },
        {
            keywords: ['typescript', 'playwright'],
            location: 'All Auckland',
            type: JOB_TYPE.FULL_TIME,
            classification: {
                category: JOB_CATEGORY.ICT,
                subcategory: JOB_ICT_SUBCATEGORY.TESTING_AND_QUALITY_ASSURANCE,
            },
            salary: {
                period: SALARY_PERIOD.HOURLY,
                from: SALARY_HOURLY.NZD_50,
            },
        },
        {
            keywords: ['typescript', 'playwright'],
            location: 'All Auckland',
            type: JOB_TYPE.FULL_TIME,
            classification: {
                category: JOB_CATEGORY.ICT,
                subcategory: JOB_ICT_SUBCATEGORY.TESTING_AND_QUALITY_ASSURANCE,
            },
            salary: {
                period: SALARY_PERIOD.HOURLY,
                from: SALARY_HOURLY.NZD_75,
            },
        },
        {
            keywords: ['typescript', 'playwright'],
            location: 'All Auckland',
            type: JOB_TYPE.FULL_TIME,
            classification: {
                category: JOB_CATEGORY.ICT,
                subcategory: JOB_ICT_SUBCATEGORY.TESTING_AND_QUALITY_ASSURANCE,
            },
            salary: {
                period: SALARY_PERIOD.HOURLY,
                from: SALARY_HOURLY.NZD_100,
            },
        },
    ];

    const seekSearch = new SeekSearchPage(page);

    for (const search of searches) {
        await seekSearch.search(search);

        await expectSearchUrl({ page, search });

        const searchPageState = await seekSearch.getSearchState({
            printLogs: true,
        });

        expectJobsCountMessage(searchPageState);

        console.log('--------------');

        await takeScreenshot({ page, name: `salary-${search?.salary?.period}-${search?.salary?.from}` });
    }
});