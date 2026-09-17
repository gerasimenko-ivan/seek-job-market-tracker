import { Page } from '@playwright/test';
import { SEEK_LOCATORS } from './seek-locators';

interface GetSearchPageStateParams {
    page: Page;
    printLogs?: boolean;
}

interface SearchPageState {
    url: string;
    keywords: string;
    location: string;
    totalJobsMessage: string | null;
}

export async function getSearchPageState(param: GetSearchPageStateParams): Promise<SearchPageState> {
    const { page, printLogs } = param;

    const url = page.url();
    const keywords = await page.locator(SEEK_LOCATORS.keywords).inputValue();
    const location = await page.locator(SEEK_LOCATORS.location).inputValue();
    const totalJobsMessage =
        await page.locator(SEEK_LOCATORS.totalJobsMessage).textContent();

    if (printLogs) {
        console.log(`URL: ${url}`);
        console.log('Keywords input:', keywords);
        console.log('Where input:', location);
        console.log(`Total Jobs Message: ${totalJobsMessage}`);
    }

    return {
        url,
        keywords,
        location,
        totalJobsMessage,
    }
}