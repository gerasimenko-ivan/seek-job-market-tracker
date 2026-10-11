import { test } from '@playwright/test';
import { SearchParamsWithoutSalary, SearchParamsWithSalary } from '../types/seek-search';
import { salaryParams } from '../data/job-market-salary-param';
import { saveJobMarketCsvRow } from '../helpers/job-market-csv';
import { collectJobCountsBySalary } from './collect-job-counts-by-salary';
import { attachFailureDiagnostics } from './attach-failure-diagnostics';

export interface JobMarketScenario {
    searchParamsWithoutSalary: SearchParamsWithoutSalary;
    outputFile: string;
}

export function defineJobMarketTests(scenarios: JobMarketScenario[]): void {
    test.afterEach(async ({ page }, testInfo) => {
        await attachFailureDiagnostics({ page, testInfo });
    });

    for (const { searchParamsWithoutSalary, outputFile } of scenarios) {
        test(`SEEK search: ${searchParamsWithoutSalary.keywords.join(' ')} - ${searchParamsWithoutSalary.location}`, async ({
            page,
        }) => {
            test.setTimeout(100000);

            const searches: SearchParamsWithSalary[] = salaryParams.map(
                (salary) => ({
                    ...searchParamsWithoutSalary,
                    salary,
                }),
            );

            const jobCountsBySalary =
                await collectJobCountsBySalary({ page, searches });

            console.log(jobCountsBySalary);

            saveJobMarketCsvRow({
                filePath: outputFile,
                searchParamsWithoutSalary,
                jobCountsBySalary,
            });
        });
    }
}