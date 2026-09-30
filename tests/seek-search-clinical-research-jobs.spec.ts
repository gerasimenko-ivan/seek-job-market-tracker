import { JOB_CATEGORY, JOB_HEALTH_SUBCATEGORY, JOB_TYPE, SearchParamsWithoutSalary } from '../src/types/seek-search';
import { defineJobMarketTests } from '../src/job-market/define-job-market-tests';

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
]);