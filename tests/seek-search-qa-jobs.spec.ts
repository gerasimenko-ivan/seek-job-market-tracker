import { test } from '@playwright/test';
import { SeekSearchPage } from '../src/pages/seek-search-page';
import { expectJobsCountMessage } from '../src/expects/expect-jobs-count';
import { expectSearchUrl } from '../src/expects/expect-search-url';
import {
    JOB_CATEGORY,
    JOB_ICT_SUBCATEGORY,
    JOB_TYPE,
    SALARY_ANNUALLY,
    SALARY_HOURLY,
    SalaryParams,
    SearchParams,
} from '../src/types/seek-search';
import { takeScreenshot } from '../src/utils/screenshot';
import { annually, hourly, salaryKey } from '../src/helpers/salary-helper';

test('SEEK search collects QA job counts', async ({ page }) => {
    test.setTimeout(100000);
    const commonSearchParams: Omit<SearchParams, 'salary'> = {
        keywords: ['typescript', 'playwright'],
        location: 'All Auckland',
        // location: 'All New Zealand',
        type: JOB_TYPE.FULL_TIME,
        classification: {
            category: JOB_CATEGORY.ICT,
            subcategory: JOB_ICT_SUBCATEGORY.TESTING_AND_QUALITY_ASSURANCE,
        },
    };

    const salaryParams: SalaryParams[] = [
        hourly(SALARY_HOURLY.NZD_35),
        hourly(SALARY_HOURLY.NZD_50),
        hourly(SALARY_HOURLY.NZD_75),
        hourly(SALARY_HOURLY.NZD_100),
        annually(SALARY_ANNUALLY.NZD_80K),
        annually(SALARY_ANNUALLY.NZD_100K),
        annually(SALARY_ANNUALLY.NZD_120K),
        annually(SALARY_ANNUALLY.NZD_150K),
    ];

    type SalarySearchParams = Omit<SearchParams, 'salary'> & {
        salary: SalaryParams;
    };

    const searches: SalarySearchParams[] = salaryParams.map((salary) => ({
        ...commonSearchParams,
        salary,
    }));

    const jobsCounts = new Map<string, number>();
    const seekSearch = new SeekSearchPage(page);

    for (const search of searches) {
        await seekSearch.search(search);

        await expectSearchUrl({ page, search });

        const searchPageState = await seekSearch.getSearchState({
            printLogs: true,
        });

        expectJobsCountMessage(searchPageState);

        jobsCounts.set(
            salaryKey(search.salary),
            searchPageState.totalJobs,
        );

        console.log('--------------');

        await takeScreenshot({ page, name: `salary-${search.salary.period}-${search.salary.from}` });
    }

    console.log(jobsCounts);
});