import { Page } from '@playwright/test';

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
    const url = param.page.url();
    const keywords = await param.page.locator('[data-automation="searchKeywordsField"] input').inputValue();
    const location = await param.page.locator('input[data-automation="SearchBar__Where"]').inputValue();
    const totalJobsMessage =
        await param.page.locator('[data-automation="totalJobsMessage"]').textContent();

    if (param.printLogs) {
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