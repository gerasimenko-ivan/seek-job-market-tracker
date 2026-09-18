import { Page, Locator } from '@playwright/test';

export enum JOB_TYPE {
    FULL_TIME = 'Full time',
    PART_TIME = 'Part time',
}

export interface SearchParams {
    keywords: string[];
    location: string;
    type: JOB_TYPE;
}

export interface GetSearchPageStateParams {
    printLogs?: boolean;
}

export interface SearchPageState {
    url: string;
    keywords: string;
    location: string;
    totalJobsMessage: string | null;
}

export class SeekSearchPage {
    readonly page: Page;

    // locators

    // inputs
    readonly keywords: Locator;
    readonly location: Locator;
    readonly seekButton: Locator;

    // filters
    readonly workTypeButton: Locator;
    readonly refineBarClose: Locator;
    readonly workTypeOption = (type: string) =>
        this.page.locator(`//*[@aria-label="${type}"]`).last();

    // results
    readonly totalJobsMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        this.keywords = page.locator(
            '[data-automation="searchKeywordsField"] input',
        );

        this.location = page.locator(
            'input[data-automation="SearchBar__Where"]',
        );

        this.seekButton = page.locator(
            'button[data-automation="searchButton"]',
        );

        this.workTypeButton = page
            .locator(
                `(//label[@data-automation="toggleWorkTypePanel"])//span[.='Type' or .='Full time' or .='Part time' or .='2 work types']`,
            )
            .last();

        this.refineBarClose = page
            .locator(`//label[@data-automation="refineBarToggleClose"]`)
            .last();

        this.totalJobsMessage = page.locator(
            '[data-automation="totalJobsMessage"]',
        );
    }

    // actions
    async goto(): Promise<void> {
        await this.page.goto('https://www.seek.co.nz/jobs', {
            waitUntil: 'domcontentloaded',
        });
    }

    async search(params: SearchParams): Promise<void> {
        const { keywords, location, type } = params;

        await this.goto();

        await this.keywords.fill(keywords.join(' '));
        await this.location.fill(location);

        await this.seekButton.click();

        // open work type
        await this.workTypeButton.click();
        // select work type
        await this.workTypeOption(type).click();
        // close work type
        await this.refineBarClose.click();
    }

    async getSearchState(params?: GetSearchPageStateParams): Promise<SearchPageState> {
        const url = this.page.url();
        const keywords = await this.keywords.inputValue();
        const location = await this.location.inputValue();
        const totalJobsMessage = await this.totalJobsMessage.textContent();

        if (params?.printLogs) {
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
        };
    }
}