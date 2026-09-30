import { JOB_CATEGORY, JOB_ICT_SUBCATEGORY, JOB_TYPE, SearchParamsWithoutSalary } from '../src/types/seek-search';
import { defineJobMarketTests } from '../src/job-market/define-job-market-tests';

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
        search: {
            keywords: ['typescript', 'playwright'],
            location: 'All Auckland',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/qa/seek-job-market-ts-pw-auck.csv',
    },
    {
        search: {
            keywords: ['typescript', 'playwright'],
            location: 'All New Zealand',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/qa/seek-job-market-ts-pw-nz.csv',
    },
    {
        search: {
            keywords: ['playwright'],
            location: 'All Auckland',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/qa/seek-job-market-pw-auck.csv',
    },
    {
        search: {
            keywords: ['playwright'],
            location: 'All New Zealand',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/qa/seek-job-market-pw-nz.csv',
    },
    {
        search: {
            keywords: ['typescript'],
            location: 'All Auckland',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/qa/seek-job-market-ts-auck.csv',
    },
    {
        search: {
            keywords: ['typescript'],
            location: 'All New Zealand',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/qa/seek-job-market-ts-nz.csv',
    },
    {
        search: {
            keywords: ['QA'],
            location: 'All Auckland',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/qa/seek-job-market-qa-auck.csv',
    },
    {
        search: {
            keywords: ['QA'],
            location: 'All New Zealand',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/qa/seek-job-market-qa-nz.csv',
    },
]);