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

interface JobMarketScenario {
    search: SearchParamsWithoutSalary;
    outputFile: string;
}

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

const commonSearchParams: Omit<
    SearchParamsWithoutSalary,
    'keywords' | 'location'
> = {
    type: JOB_TYPE.FULL_TIME,
    classification: {
        category: JOB_CATEGORY.ICT,
        subcategory: JOB_ICT_SUBCATEGORY.TESTING_AND_QUALITY_ASSURANCE,
    },
};

const scenarios: JobMarketScenario[] = [
    {
        search: {
            keywords: ['typescript', 'playwright'],
            location: 'All Auckland',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/seek-job-market-ts-pw-auck.csv',
    },
    {
        search: {
            keywords: ['typescript', 'playwright'],
            location: 'All New Zealand',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/seek-job-market-ts-pw-nz.csv',
    },
    {
        search: {
            keywords: ['playwright'],
            location: 'All Auckland',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/seek-job-market-pw-auck.csv',
    },
    {
        search: {
            keywords: ['playwright'],
            location: 'All New Zealand',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/seek-job-market-pw-nz.csv',
    },
    {
        search: {
            keywords: ['typescript'],
            location: 'All Auckland',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/seek-job-market-ts-auck.csv',
    },
    {
        search: {
            keywords: ['typescript'],
            location: 'All New Zealand',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/seek-job-market-ts-nz.csv',
    },
    {
        search: {
            keywords: ['QA'],
            location: 'All Auckland',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/seek-job-market-qa-auck.csv',
    },
    {
        search: {
            keywords: ['QA'],
            location: 'All New Zealand',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/seek-job-market-qa-nz.csv',
    },
];

for (const { search, outputFile } of scenarios) {
    test(`SEEK search: ${search.keywords.join(' ')} - ${search.location}`, async ({
        page,
    }) => {
        test.setTimeout(100000);

        const searches: SearchParamsWithSalary[] = salaryParams.map(
            (salary) => ({
                ...search,
                salary,
            }),
        );

        const jobsCounts = new Map<string, number>();
        const seekSearch = new SeekSearchPage(page);

        for (const search of searches) {
            await seekSearch.search(search);

            await expectSearchUrl({ page, search });

            const searchPageState = await seekSearch.getSearchState();

            expectJobsCountMessage(searchPageState);

            jobsCounts.set(salaryKey(search.salary), searchPageState.totalJobs);
        }

        console.log(jobsCounts);

        saveJobMarketCsvRow({
            filePath: outputFile,
            search: search,
            jobsCounts,
        });
    });
}