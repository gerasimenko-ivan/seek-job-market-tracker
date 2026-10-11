import { Page, test } from '@playwright/test';
import { SearchParamsWithoutSalary, SearchParamsWithSalary } from '../types/seek-search';
import { salaryParams } from '../data/job-market-salary-param';
import { SeekSearchPage } from '../pages/seek-search-page';
import { expectSearchUrl } from '../expects/expect-search-url';
import { expectJobsCountMessage } from '../expects/expect-jobs-count';
import { salaryKey } from '../helpers/salary-helper';
import { saveJobMarketCsvRow } from '../helpers/job-market-csv';

export interface JobMarketScenario {
    searchParamsWithoutSalary: SearchParamsWithoutSalary;
    outputFile: string;
}

export interface CollectJobCountsBySalary {
    page: Page;
    searches: SearchParamsWithSalary[];
}

async function collectJobCountsBySalary(
    params: CollectJobCountsBySalary,
): Promise<Map<string, number>> {
    const { page, searches } = params;

    const seekSearch = new SeekSearchPage(page);
    const jobCountsBySalary = new Map<string, number>();

    for (const searchParamsWithSalary of searches) {
        await seekSearch.search(searchParamsWithSalary);

        await expectSearchUrl({
            page,
            search: searchParamsWithSalary,
        });

        const searchPageState = await seekSearch.getSearchState();

        expectJobsCountMessage(searchPageState);

        jobCountsBySalary.set(
            salaryKey(searchParamsWithSalary.salary),
            searchPageState.totalJobs,
        );
    }

    return jobCountsBySalary;
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