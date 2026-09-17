import { Page } from '@playwright/test';
import { SEEK_LOCATORS } from './seek-locators';

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

    await page.locator(SEEK_LOCATORS.keywords).fill(keywords.join(' '));
    await page.locator(SEEK_LOCATORS.location).fill(location);

    await page.locator(SEEK_LOCATORS.seekButton).click();

    // open work type — there are duplicate controls, use the last one
    await page.locator(SEEK_LOCATORS.workTypeButton).last().click();

    // select work type
    await page.locator(SEEK_LOCATORS.workTypeOption(type)).last().click();

    // close work type
    await page
        .locator(SEEK_LOCATORS.refineBarClose)
        .last()
        .click();
}