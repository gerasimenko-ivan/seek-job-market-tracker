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
    SearchParamsWithoutSalary,
    SearchParamsWithSalary,
} from '../src/types/seek-search';
import { annually, hourly, salaryKey } from '../src/helpers/salary-helper';
import { saveJobMarketCsvRow } from '../src/helpers/job-market-csv';

test('SEEK search collects QA job counts', async ({ page }) => {
    test.setTimeout(100000);
    const commonSearchParams: SearchParamsWithoutSalary = {
        keywords: ['typescript', 'playwright'],
        // keywords: ['playwright'],
        // keywords: ['typescript'],
        // keywords: ['QA'],
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

    const searches: SearchParamsWithSalary[] = salaryParams.map((salary) => ({
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
    }

    console.log(jobsCounts);

    saveJobMarketCsvRow({
        filePath: 'output/csv/seek-job-market-ts-pw-auck.csv',
        // filePath: 'output/csv/seek-job-market-ts-pw-nz.csv',
        // filePath: 'output/csv/seek-job-market-pw-auck.csv',
        // filePath: 'output/csv/seek-job-market-pw-nz.csv',
        // filePath: 'output/csv/seek-job-market-ts-auck.csv',
        // filePath: 'output/csv/seek-job-market-ts-nz.csv',
        // filePath: 'output/csv/seek-job-market-qa-auck.csv',
        // filePath: 'output/csv/seek-job-market-qa-nz.csv',
        search: commonSearchParams,
        jobsCounts,
    });
});