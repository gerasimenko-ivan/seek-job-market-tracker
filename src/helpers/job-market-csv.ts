import { jobMarketCsvHeaders, jobMarketSalaryColumns } from '../types/job-market-csv.js';
import { appendCsvRow } from '../utils/csv.js';

import type {
    CreateJobMarketCsvRow,
    JobMarketCsvRow,
    JobMarketCsvRowBase,
    JobMarketSalaryColumn,
    SaveJobMarketCsvRowParams,
} from '../types/job-market-csv.js';

export function createJobMarketCsvRow(
    param: CreateJobMarketCsvRow,
): JobMarketCsvRow {
    const date = new Date().toISOString().slice(0, 10);
    const classification = param.searchParamsWithoutSalary.classification?.subcategory
        ? `${param.searchParamsWithoutSalary.classification.category} - ${param.searchParamsWithoutSalary.classification.subcategory}`
        : (param.searchParamsWithoutSalary.classification?.category ?? '');

    const row: JobMarketCsvRowBase = {
        date,
        keywords: param.searchParamsWithoutSalary.keywords.join(' '),
        location: param.searchParamsWithoutSalary.location,
        type: param.searchParamsWithoutSalary.type,
        classification,
    };

    const salaryValues = Object.fromEntries(
        jobMarketSalaryColumns.map((column) => [
            column,
            getJobCountBySalary(param.jobCountsBySalary, column),
        ]),
    ) as Record<JobMarketSalaryColumn, number>;

    return {
        ...row,
        ...salaryValues,
    };
}

function getJobCountBySalary(
    jobCountsBySalary: Map<string, number>,
    key: JobMarketSalaryColumn,
): number {
    const count = jobCountsBySalary.get(key);

    if (count === undefined) {
        throw new Error(`Jobs count not found for key "${key}"`);
    }

    return count;
}

export function jobMarketCsvValues(row: JobMarketCsvRow): (string | number)[] {
    return [
        row.date,
        row.keywords,
        row.location,
        row.type,
        row.classification,
        ...jobMarketSalaryColumns.map((column) => row[column]),
    ];
}

export function saveJobMarketCsvRow(param: SaveJobMarketCsvRowParams): void {
    const row = createJobMarketCsvRow(param);

    appendCsvRow({
        filePath: param.filePath,
        headers: jobMarketCsvHeaders,
        values: jobMarketCsvValues(row),
    });
}