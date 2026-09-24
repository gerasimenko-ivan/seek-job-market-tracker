import {
    CreateJobMarketCsvRow,
    jobMarketCsvHeaders,
    JobMarketCsvRow,
    JobMarketCsvRowBase,
    JobMarketSalaryColumn,
    jobMarketSalaryColumns,
    SaveJobMarketCsvRowParams,
} from '../types/job-market-csv';
import { appendCsvRow } from '../utils/csv';

export function createJobMarketCsvRow(
    param: CreateJobMarketCsvRow,
): JobMarketCsvRow {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const classification = param.search.classification?.subcategory
        ? `${param.search.classification.category} - ${param.search.classification.subcategory}`
        : (param.search.classification?.category ?? '');

    const row: JobMarketCsvRowBase = {
        date: timestamp,
        keywords: param.search.keywords.join(' '),
        location: param.search.location,
        type: param.search.type,
        classification,
    };

    const salaryValues = Object.fromEntries(
        jobMarketSalaryColumns.map((column) => [
            column,
            getJobsCount(param.jobsCounts, column),
        ]),
    ) as Record<JobMarketSalaryColumn, number>;

    return {
        ...row,
        ...salaryValues,
    };
}

function getJobsCount(
    jobsCounts: Map<string, number>,
    key: JobMarketSalaryColumn,
): number {
    const count = jobsCounts.get(key);

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