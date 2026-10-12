import type { SearchParamsWithoutSalary } from './seek-search.js';
import type { JobMarketSalaryColumn } from '../data/job-market-csv.js';

export interface CreateJobMarketCsvRow {
    searchParamsWithoutSalary: SearchParamsWithoutSalary;
    jobCountsBySalary: Map<string, number>;
}

export interface SaveJobMarketCsvRowParams extends CreateJobMarketCsvRow {
    filePath: string;
}

export interface JobMarketCsvRowBase {
    date: string;
    keywords: string;
    location: string;
    type: string;
    classification: string;
}

export type JobMarketCsvRow = JobMarketCsvRowBase &
    Record<JobMarketSalaryColumn, number>;