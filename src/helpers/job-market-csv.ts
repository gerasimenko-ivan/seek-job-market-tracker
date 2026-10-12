import { appendCsvRow } from '../utils/csv.js';
import {
    jobMarketCsvHeaders,
    jobMarketSalaryColumns,
    type JobMarketSalaryColumn,
} from '../data/job-market-csv.js';

import type {
    CreateJobMarketCsvRow,
    JobMarketCsvRow,
    JobMarketCsvRowBase,
    SaveJobMarketCsvRowParams,
} from '../types/job-market-csv.js';

export function createJobMarketCsvRow(
    param: CreateJobMarketCsvRow,
): JobMarketCsvRow {
    const { searchParamsWithoutSalary, jobCountsBySalary } = param;

    const date = new Date().toISOString().slice(0, 10);
    const classification = searchParamsWithoutSalary.classification?.subcategory
        ? `${searchParamsWithoutSalary.classification.category} - ${searchParamsWithoutSalary.classification.subcategory}`
        : (searchParamsWithoutSalary.classification?.category ?? '');

    const rowBase: JobMarketCsvRowBase = {
        date,
        keywords: searchParamsWithoutSalary.keywords.join(' '),
        location: searchParamsWithoutSalary.location,
        type: searchParamsWithoutSalary.type,
        classification,
    };

    const salaryValues = Object.fromEntries(
        jobMarketSalaryColumns.map((column) => [
            column,
            getJobCountBySalary(jobCountsBySalary, column),
        ]),
    ) as Record<JobMarketSalaryColumn, number>;

    return {
        ...rowBase,
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