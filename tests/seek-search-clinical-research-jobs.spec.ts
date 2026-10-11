import { JOB_CATEGORY, JOB_HEALTH_SUBCATEGORY, JOB_TYPE, SearchParamsWithoutSalary } from '../src/types/seek-search';
import { defineJobMarketTests } from '../src/job-market-tests/define-job-market-tests';

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

defineJobMarketTests([
    {
        searchParamsWithoutSalary: {
            keywords: ['GCP'],
            location: 'All Auckland',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/clinical-research/seek-job-gcp-auck.csv',
    },
    {
        searchParamsWithoutSalary: {
            keywords: ['GCP'],
            location: 'All New Zealand',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/clinical-research/seek-job-gcp-nz.csv',
    },
    {
        searchParamsWithoutSalary: {
            keywords: ['clinical trials'],
            location: 'All Auckland',
            ...commonSearchParams,
        },
        outputFile:
            'output/csv/clinical-research/seek-job-clinical-trials-auck.csv',
    },
    {
        searchParamsWithoutSalary: {
            keywords: ['clinical trials'],
            location: 'All New Zealand',
            ...commonSearchParams,
        },
        outputFile:
            'output/csv/clinical-research/seek-job-clinical-trials-nz.csv',
    },
    {
        searchParamsWithoutSalary: {
            keywords: ['clinical research associate'],
            location: 'All Auckland',
            ...commonSearchParams,
        },
        outputFile:
            'output/csv/clinical-research/seek-job-cr-associate-auck.csv',
    },
    {
        searchParamsWithoutSalary: {
            keywords: ['clinical research associate'],
            location: 'All New Zealand',
            ...commonSearchParams,
        },
        outputFile:
            'output/csv/clinical-research/seek-job-cr-associate-nz.csv',
    },
]);