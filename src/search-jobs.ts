import { Page } from '@playwright/test';
import { SeekSearchPage } from './pages/seek-search-page';

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

    const seekSearch = new SeekSearchPage(page);

    await seekSearch.goto();

    await seekSearch.keywords.fill(keywords.join(' '));
    await seekSearch.location.fill(location);

    await seekSearch.seekButton.click();

    // open work type
    await seekSearch.workTypeButton.click();
    // select work type
    await seekSearch.workTypeOption(type).click();
    // close work type
    await seekSearch.refineBarClose.click();
}