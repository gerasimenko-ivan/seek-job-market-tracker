import { expect } from '@playwright/test';
import {
    FILTER_MESSAGE,
    SALARY_ANNUALLY,
    SALARY_HOURLY,
    SALARY_PERIOD,
} from '../types/seek-search.js';
import { parseJobsCount } from '../helpers/string-helper.js';

import type { Locator, Page } from '@playwright/test';
import type {
    JOB_TYPE,
    JobClassification,
    SalaryParams,
    SearchPageState,
    SearchParams,
} from '../types/seek-search.js';

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

    readonly classificationButton: Locator;

    readonly classificationOption = (category: string) =>
        this.page.getByTestId('item-text').getByText(category).last();

    readonly salaryButton: Locator;

    readonly salaryPeriod = (period: SALARY_PERIOD) =>
        this.page.getByTestId('salaryType').getByText(period).last();

    readonly salaryFromButton: Locator;
    readonly salaryToButton: Locator;

    readonly salaryRangeFromItem = (from: SALARY_ANNUALLY | SALARY_HOURLY) =>
        this.page
            .getByTestId('refineSalaryRangeFrom')
            .locator('label')
            .filter({ hasText: from })
            .last();

    readonly salaryRangeToItem = (to: SALARY_ANNUALLY | SALARY_HOURLY) =>
        this.page
            .getByTestId('refineSalaryRangeTo')
            .locator('label')
            .filter({ hasText: to })
            .last();

    readonly filterMessageNoResults: Locator;

    // results
    readonly totalJobsMessage: Locator;
    /** SEEK shows two different total job messages occasionally */
    readonly totalJobsMessage2: Locator;

    constructor(page: Page) {
        this.page = page;

        this.keywords = page
            .getByTestId('searchKeywordsField')
            .locator('input')
            .last();

        this.location = page.getByTestId('SearchBar__Where');

        this.seekButton = page.getByTestId('searchButton');

        this.workTypeButton = page.getByTestId('toggleWorkTypePanel').last();

        this.refineBarClose = page.getByTestId('refineBarToggleClose').last();

        this.classificationButton = page
            .getByTestId('toggleClassificationPanel')
            .last();

        this.totalJobsMessage = page.getByTestId('totalJobsMessage');
        this.totalJobsMessage2 = page.getByTestId('jobCounter');

        this.salaryButton = page.getByTestId('toggleSalaryRangePanel').last();
        this.salaryFromButton = page.getByTestId('salaryFieldFrom').last();
        this.salaryToButton = page.getByTestId('salaryFieldTo').last();

        this.filterMessageNoResults = page.getByTestId('search-zero-results');
    }

    // actions
    async goto(): Promise<void> {
        await this.page.goto('https://www.seek.co.nz/jobs', {
            waitUntil: 'domcontentloaded',
        });
    }

    async search(params: SearchParams): Promise<void> {
        const { keywords, location, type, classification, salary } = params;

        await this.goto();

        await this.keywords.fill(keywords.join(' '));
        await this.location.fill(location);

        await this.seekButton.click();

        await this.selectWorkType(type);

        if (classification) {
            await this.selectClassification(classification);
        }

        if (salary) {
            await this.selectSalary(salary);
        }
    }

    async selectWorkType(type: JOB_TYPE): Promise<void> {
        // await this.workTypeButton.click();
        // BEGIN workaround: SEEK may ignore Type-filter clicks while the search UI is settling.
        let isPanelVisible = false;
        for (let i = 0; i < 20; i++) {
            await this.page.waitForTimeout(400);
            await this.workTypeButton.click();
            await this.page.waitForTimeout(100);
            isPanelVisible = await this.workTypeOption(type).isVisible({
                timeout: 0,
            });
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
    }

    async selectClassification(
        classification: JobClassification,
    ): Promise<void> {
        await this.classificationButton.click();

        await this.classificationOption(classification.category).click();

        if (classification.subcategory) {
            await this.classificationOption(classification.subcategory).click();
        }

        await this.refineBarClose.click({ position: { x: 0, y: 0 } });
    }

    async selectSalary(param: SalaryParams): Promise<void> {
        const { period, from, to } = param;

        if (!(from || to)) {
            throw new Error(
                `No salary range specified. If salary.period=${period} is specified at least one of params salary.from or salary.to must be specified`,
            );
        }

        await this.salaryButton.click();
        await this.salaryPeriod(period).click();

        if (from) {
            await this.salaryFromButton.click();
            await this.salaryRangeFromItem(from).click();
        }

        if (to) {
            await this.salaryToButton.click();
            await this.salaryRangeToItem(to).click();
        }

        await this.refineBarClose.click({ position: { x: 0, y: 0 } });
    }

    async getSearchState(
        params?: GetSearchPageStateParams,
    ): Promise<SearchPageState> {
        const url = this.page.url();
        const keywords = await this.keywords.inputValue();
        const location = await this.location.inputValue();
        const salary = await this.salaryButton.textContent();
        const classification = await this.classificationButton.textContent();
        const type = await this.workTypeButton.textContent();

        const searchResult = await this.waitForSearchResult();

        let totalJobsMessage: string | null;
        let totalJobs: number;
        switch (searchResult) {
            case 'NO_RESULTS':
                totalJobsMessage = FILTER_MESSAGE.NO_RESULTS;
                totalJobs = 0;
                break;
            case 'JOBS_FOUND':
                totalJobsMessage = await this.totalJobsMessage.textContent();
                totalJobs = parseJobsCount(totalJobsMessage);
                break;
            case 'JOBS_FOUND_2':
                totalJobsMessage = await this.totalJobsMessage2.textContent();
                totalJobs = parseJobsCount(totalJobsMessage);
                break;
            default:
                throw new Error(`Unexpected search result: '${searchResult}'`);
        }

        if (params?.printLogs) {
            console.log(`----------------`);
            console.log(`URL: ${url}`);
            console.log('Keywords input:', keywords);
            console.log('Where input:', location);
            console.log('Salary:', salary);
            console.log('Classification:', classification);
            console.log('Type:', type);
            console.log(`Total Jobs Message: ${totalJobsMessage}`);
            console.log(`Total Jobs: ${totalJobs}`);
            console.log(`----------------`);
        }

        return {
            url,
            keywords,
            location,
            salary,
            classification,
            type,
            totalJobsMessage,
            totalJobs,
        };
    }

    async waitForSearchResult(): Promise<
        'NO_RESULTS' | 'JOBS_FOUND' | 'JOBS_FOUND_2'
    > {
        // TODO: replace fixed wait with proper synchronization
        await this.page.waitForTimeout(1000);

        const timeout = 10000;

        try {
            return await Promise.any([
                this.totalJobsMessage
                    .waitFor({ state: 'visible', timeout })
                    .then(() => 'JOBS_FOUND' as const),

                this.totalJobsMessage2
                    .waitFor({ state: 'visible', timeout })
                    .then(() => 'JOBS_FOUND_2' as const),

                this.filterMessageNoResults
                    .waitFor({ state: 'visible', timeout })
                    .then(() => 'NO_RESULTS' as const),
            ]);
        } catch {
            throw new Error(
                `No recognized search result state became visible within ${timeout} ms.`,
            );
        }
    }
}