import { expect, Locator, Page } from '@playwright/test';
import { takeScreenshot } from '../utils/screenshot';
import { parseJobsCount } from '../parse-jobs-count';
import { SearchPageState, SearchParams } from '../types/seek-search';

export interface GetSearchPageStateParams {
    printLogs?: boolean;
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

        // await this.workTypeButton.click();
        // BEGIN workaround: SEEK may ignore Type-filter clicks while the search UI is settling.
        let isPanelVisible = false;
        for (let i = 0; i < 10; i++) {
            await this.workTypeButton.click();
            isPanelVisible = await this.workTypeOption(type).isVisible({
                timeout: 0,
            });
            await this.page.waitForTimeout(500);
            console.log(`${i} - ${isPanelVisible}`);
            if (isPanelVisible) {
                break;
            }
        }
        expect(isPanelVisible).toBe(true);
        // END workaround

        // select work type
        await this.workTypeOption(type).click();

        // close work type
        await this.refineBarClose.click();

        await takeScreenshot({ page: this.page, name: 'filters-applied' });
    }

    async getSearchState(params?: GetSearchPageStateParams): Promise<SearchPageState> {
        const url = this.page.url();
        const keywords = await this.keywords.inputValue();
        const location = await this.location.inputValue();
        const totalJobsMessage = await this.totalJobsMessage.textContent();
        const totalJobs = parseJobsCount(totalJobsMessage);

        if (params?.printLogs) {
            console.log(`URL: ${url}`);
            console.log('Keywords input:', keywords);
            console.log('Where input:', location);
            console.log(`Total Jobs Message: ${totalJobsMessage}`);
            console.log(`Total Jobs: ${totalJobs}`);
        }

        return {
            url,
            keywords,
            location,
            totalJobsMessage,
            totalJobs,
        };
    }
}