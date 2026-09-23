import {
    CreateJobMarketCsvRow,
    JobMarketCsvRow,
} from '../types/job-market-csv';

export function createJobMarketCsvRow(
    param: CreateJobMarketCsvRow,
): JobMarketCsvRow {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const classification = param.search.classification?.subcategory
        ? `${param.search.classification.category} - ${param.search.classification.subcategory}`
        : (param.search.classification?.category ?? '');

    return {
        date: timestamp,
        keywords: param.search.keywords.join(' '),
        location: param.search.location,
        type: param.search.type,
        classification,
        hourly_35_plus: getJobsCount(param.jobsCounts, 'hourly_35_plus'),
        hourly_50_plus: getJobsCount(param.jobsCounts, 'hourly_50_plus'),
        hourly_75_plus: getJobsCount(param.jobsCounts, 'hourly_75_plus'),
        hourly_100_plus: getJobsCount(param.jobsCounts, 'hourly_100_plus'),
        annual_80K_plus: getJobsCount(param.jobsCounts, 'annual_80K_plus'),
        annual_100K_plus: getJobsCount(param.jobsCounts, 'annual_100K_plus'),
        annual_120K_plus: getJobsCount(param.jobsCounts, 'annual_120K_plus'),
        annual_150K_plus: getJobsCount(param.jobsCounts, 'annual_150K_plus'),
    };
}

function getJobsCount(jobsCounts: Map<string, number>, key: string): number {
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
        row.hourly_35_plus,
        row.hourly_50_plus,
        row.hourly_75_plus,
        row.hourly_100_plus,
        row.annual_80K_plus,
        row.annual_100K_plus,
        row.annual_120K_plus,
        row.annual_150K_plus,
    ];
}