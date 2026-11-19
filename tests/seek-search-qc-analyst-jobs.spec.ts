import { JOB_CATEGORY, JOB_MTL_SUBCATEGORY, JOB_TYPE, SearchParamsWithoutSalary } from '../src/types/seek-search';
import { defineJobMarketTests } from '../src/job-market-tests/define-job-market-tests';

const commonSearchParams: Omit<
    SearchParamsWithoutSalary,
    'keywords' | 'location'
> = {
    type: JOB_TYPE.FULL_TIME,
    classification: {
        category: JOB_CATEGORY.MTL,
        subcategory: JOB_MTL_SUBCATEGORY.QUALITY_ASSURANCE_AND_CONTROL,
    },
};

defineJobMarketTests([
    {
        searchParamsWithoutSalary: {
            keywords: ['qc analyst', 'HPLC', 'LIMS'],
            location: 'All Auckland',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/qc-analyst/seek-job-qc-analyst-auck.csv',
    },
    {
        searchParamsWithoutSalary: {
            keywords: ['qc analyst', 'HPLC', 'LIMS'],
            location: 'All New Zealand',
            ...commonSearchParams,
        },
        outputFile: 'output/csv/qc-analyst/seek-job-qc-analyst-nz.csv',
    },
]);