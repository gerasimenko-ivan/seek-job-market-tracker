import { test } from '@playwright/test';
import { SeekSearchPage } from '../src/pages/seek-search-page';
import { expectJobsCountMessage } from '../src/expects/expect-jobs-count';
import { expectSearchUrl } from '../src/expects/expect-search-url';
import {
    JOB_CATEGORY,
    JOB_HEALTH_SUBCATEGORY,
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
        category: JOB_CATEGORY.HEALTH,
        subcategory: JOB_HEALTH_SUBCATEGORY.CLINICAL_MEDICAL_RESEARCH,
    },
};

const scenarios: JobMarketScenario[] = [
    {
        search: {
            keywords: ['GCP'],
            location: 'All Auckland',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/clinical-research/seek-job-gcp-auck.csv',
    },
    {
        search: {
            keywords: ['GCP'],
            location: 'All New Zealand',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/clinical-research/seek-job-gcp-nz.csv',
    },
    {
        search: {
            keywords: ['clinical trials'],
            location: 'All Auckland',
            ...commonSearchParams,
        },
        outputFile:
            'output/csv/clinical-research/seek-job-clinical-trials-auck.csv',
    },
    {
        search: {
            keywords: ['clinical trials'],
            location: 'All New Zealand',
            ...commonSearchParams,
        },
        outputFile:
            'output/csv/clinical-research/seek-job-clinical-trials-nz.csv',
    },
    {
        search: {
            keywords: ['clinical research associate'],
            location: 'All Auckland',
            ...commonSearchParams,
        },
        outputFile:
            'output/csv/clinical-research/seek-job-cr-associate-auck.csv',
    },
    {
        search: {
            keywords: ['clinical research associate'],
            location: 'All New Zealand',
            ...commonSearchParams,
        },
        outputFile:
            'output/csv/clinical-research/seek-job-cr-associate-nz.csv',
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