import { Page } from '@playwright/test';

export enum JOB_TYPE {
    FULL_TIME = 'Full time',
    PART_TIME = 'Part time',
}

interface SearchJobsRequest {
    page: Page;
    keywords: string[];
    location: string;
    type: JOB_TYPE;
}

export async function searchJobs(param: SearchJobsRequest): Promise<void> {
    const { page, keywords, location, type } = param;

    await page.goto('https://www.seek.co.nz/jobs', {
        waitUntil: 'domcontentloaded',
    });

    await page
        .locator('[data-automation="searchKeywordsField"] input')
        .fill(keywords.join(' '));

    await page
        .locator('input[data-automation="SearchBar__Where"]')
        .fill(location);

    await page.locator('button[data-automation="searchButton"]').click();

    // open work type — there are duplicate controls, use the last one
    const workTypeButton = `(//label[@data-automation="toggleWorkTypePanel"])//span[.='Type' or .='Full time' or .='Part time' or .='2 work types']`;
    await page.locator(workTypeButton).last().click();

    // select work type
    await page.locator(`//*[@aria-label="${type}"]`).last().click();

    // close work type
    await page
        .locator(`//label[@data-automation="refineBarToggleClose"]`)
        .last()
        .click();
}