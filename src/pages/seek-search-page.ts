import { Page, Locator } from '@playwright/test';

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
}
