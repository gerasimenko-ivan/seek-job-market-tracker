import { Page } from '@playwright/test';

interface SearchJobsRequest {
    page: Page;
    keywords: string[];
    location: string;
}

export async function searchJobs(param: SearchJobsRequest): Promise<void> {
    await param.page.goto('https://www.seek.co.nz/jobs', {
        waitUntil: 'domcontentloaded'
    });

    await param.page
        .locator('[data-automation="searchKeywordsField"] input')
        .fill(param.keywords.join(' '));

    await param.page
        .locator('input[data-automation="SearchBar__Where"]')
        .fill(param.location);

    await param.page
        .locator('button[data-automation="searchButton"]')
        .click();
}