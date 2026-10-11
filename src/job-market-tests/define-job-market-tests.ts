import { test } from '@playwright/test';
import { salaryParams } from '../data/job-market-salary-param.js';
import { saveJobMarketCsvRow } from '../helpers/job-market-csv.js';
import { collectJobCountsBySalary } from './collect-job-counts-by-salary.js';
import { attachFailureDiagnostics } from '../utils/attach-failure-diagnostics.js';

import type {
    SearchParamsWithoutSalary,
    SearchParamsWithSalary,
} from '../types/seek-search.js';

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