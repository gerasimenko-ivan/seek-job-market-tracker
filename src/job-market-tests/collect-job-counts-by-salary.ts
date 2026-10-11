import type { Page } from '@playwright/test';
import type { SearchParamsWithSalary } from '../types/seek-search';

import { expectJobsCountMessage } from '../expects/expect-jobs-count';
import { salaryKey } from '../helpers/salary-helper';
import { expectSearchUrl } from '../expects/expect-search-url';
import { SeekSearchPage } from '../pages/seek-search-page';

interface CollectJobCountsBySalary {
    page: Page;
    searches: SearchParamsWithSalary[];
}

export async function collectJobCountsBySalary(
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