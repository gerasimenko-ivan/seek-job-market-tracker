import { Page } from '@playwright/test';
import { SeekSearchPage } from './pages/seek-search-page';

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
    const seekSearch = new SeekSearchPage(page);

    const url = page.url();
    const keywords = await seekSearch.keywords.inputValue();
    const location = await seekSearch.location.inputValue();
    const totalJobsMessage = await seekSearch.totalJobsMessage.textContent();

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