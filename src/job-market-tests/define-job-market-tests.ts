import { test } from '@playwright/test';
import { SearchParamsWithoutSalary, SearchParamsWithSalary } from '../types/seek-search';
import { salaryParams } from '../data/job-market-salary-param';
import { saveJobMarketCsvRow } from '../helpers/job-market-csv';
import { collectJobCountsBySalary } from './collect-job-counts-by-salary';

export interface JobMarketScenario {
    searchParamsWithoutSalary: SearchParamsWithoutSalary;
    outputFile: string;
}

export function defineJobMarketTests(scenarios: JobMarketScenario[]): void {
    test.afterEach(async ({ page }, testInfo) => {
        if (testInfo.status !== 'failed') {
            return;
        }

        try {
            const screenshot = await page.screenshot({
                path: testInfo.outputPath('failure.png'),
                fullPage: true,
            });

            await testInfo.attach('Failure screenshot', {
                body: screenshot,
                contentType: 'image/png',
            });
        } catch (error) {
            console.warn('Could not capture failure screenshot:', error);
        }

        try {
            const html = await page.content();

            await testInfo.attach('DOM', {
                body: html,
                contentType: 'text/html',
            });
        } catch (error) {
            console.warn('Could not capture failure DOM:', error);
        }
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