import { JOB_CATEGORY, JOB_ICT_SUBCATEGORY, JOB_TYPE, SearchParamsWithoutSalary } from '../src/types/seek-search';
import { defineJobMarketTests } from '../src/job-market-tests/define-job-market-tests';

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

defineJobMarketTests([
    {
        searchParamsWithoutSalary: {
            keywords: ['typescript', 'playwright'],
            location: 'All Auckland',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/qa/seek-job-market-ts-pw-auck.csv',
    },
    {
        searchParamsWithoutSalary: {
            keywords: ['typescript', 'playwright'],
            location: 'All New Zealand',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/qa/seek-job-market-ts-pw-nz.csv',
    },
    {
        searchParamsWithoutSalary: {
            keywords: ['playwright'],
            location: 'All Auckland',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/qa/seek-job-market-pw-auck.csv',
    },
    {
        searchParamsWithoutSalary: {
            keywords: ['playwright'],
            location: 'All New Zealand',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/qa/seek-job-market-pw-nz.csv',
    },
    {
        searchParamsWithoutSalary: {
            keywords: ['typescript'],
            location: 'All Auckland',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/qa/seek-job-market-ts-auck.csv',
    },
    {
        searchParamsWithoutSalary: {
            keywords: ['typescript'],
            location: 'All New Zealand',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/qa/seek-job-market-ts-nz.csv',
    },
    {
        searchParamsWithoutSalary: {
            keywords: ['QA'],
            location: 'All Auckland',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/qa/seek-job-market-qa-auck.csv',
    },
    {
        searchParamsWithoutSalary: {
            keywords: ['QA'],
            location: 'All New Zealand',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/qa/seek-job-market-qa-nz.csv',
    },
]);