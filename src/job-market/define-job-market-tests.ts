import { test } from '@playwright/test';
import { SearchParamsWithoutSalary, SearchParamsWithSalary } from '../types/seek-search';
import { salaryParams } from '../data/job-market-salary-param';
import { SeekSearchPage } from '../pages/seek-search-page';
import { expectSearchUrl } from '../expects/expect-search-url';
import { expectJobsCountMessage } from '../expects/expect-jobs-count';
import { salaryKey } from '../helpers/salary-helper';
import { saveJobMarketCsvRow } from '../helpers/job-market-csv';

export interface JobMarketScenario {
    search: SearchParamsWithoutSalary;
    outputFile: string;
}

export function defineJobMarketTests(scenarios: JobMarketScenario[]): void {
    for (const { search, outputFile } of scenarios) {
        test(`SEEK search: ${search.keywords.join(' ')} - ${search.location}`, async ({
            page,
        }) => {
            test.setTimeout(100000);

            const searches: SearchParamsWithSalary[] = salaryParams.map(
                (salary) => ({
                    ...search,
                    salary,
                }),
            );

            const jobsCounts = new Map<string, number>();
            const seekSearch = new SeekSearchPage(page);

            for (const search of searches) {
                await seekSearch.search(search);

                await expectSearchUrl({ page, search });

                const searchPageState = await seekSearch.getSearchState();

                expectJobsCountMessage(searchPageState);

                jobsCounts.set(
                    salaryKey(search.salary),
                    searchPageState.totalJobs,
                );
            }

            console.log(jobsCounts);

            saveJobMarketCsvRow({
                filePath: outputFile,
                search: search,
                jobsCounts,
            });
        });
    }
}