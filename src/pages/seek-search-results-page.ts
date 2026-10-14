import { locationTypeFromText } from '../helpers/location-helper.js';
import { LOCATION_TYPE, WORK_ARRANGEMENT } from '../types/seek-search.js';
import { workArrangementFromText } from '../helpers/work-arrangement-helper.js';
import { extractJobKeywords } from '../helpers/keyword-helper.js';
import { QA_JOB_KEYWORD } from '../data/keyword-qa.js';

import type { Locator, Page } from '@playwright/test';

export interface JobCard {
    title: string;
    company: string;
    location: string;
    locationType: LOCATION_TYPE;
    workArrangement?: WORK_ARRANGEMENT;
    shortDescription: string;
    keywords: QA_JOB_KEYWORD[];
}

export class SeekSearchResultsPage {
    private readonly page: Page;

    readonly jobCards: Locator;

    readonly jobCard = (index: number) => this.jobCards.nth(index);

    readonly paginationOfResults: Locator;
    readonly resultPages: Locator;
    readonly resultPage = (index: number) =>
        this.resultPages.nth(index);

    constructor(page: Page) {
        this.page = page;

        this.jobCards = this.page.locator('[data-testid="job-card"]');

        this.paginationOfResults = this.page.locator(
            '[aria-label="Pagination of results"]',
        );
        this.resultPages = this.paginationOfResults.locator(
            '//*[contains(@aria-label,"Go to page")]',
        );
    }

    async getJobCardCount(): Promise<number> {
        return this.jobCards.count();
    }

    async getJobCard(index: number): Promise<JobCard> {
        const jobCard = this.jobCard(index);

        const location = await jobCard
            .getByTestId('jobCardLocation')
            .innerText();

        const workArrangement = jobCard.locator(
            '[data-testid="work-arrangement"]',
        );

        const workArrangementText = (await workArrangement.isVisible())
            ? await workArrangement.innerText()
            : undefined;

        const title = await jobCard.getByTestId('jobTitle').innerText();
        const shortDescription = await jobCard
            .getByTestId('jobShortDescription')
            .innerText();

        return {
            title,
            company: await jobCard.getByTestId('jobCompany').innerText(),
            location,
            locationType: locationTypeFromText(location),
            workArrangement: workArrangementFromText(workArrangementText),
            shortDescription,
            keywords: extractJobKeywords({
                text: `${title} ${shortDescription}`,
                keywords: Object.values(QA_JOB_KEYWORD),
            }),
        };
    }

    async getJobCards(): Promise<JobCard[]> {
        const count = await this.getJobCardCount();

        return Promise.all(
            Array.from({ length: count }, (_, index) => this.getJobCard(index)),
        );
    }

    async clickJobCard(index: number): Promise<void> {
        await this.jobCard(index).click();
    }

    async scrollToJobCard(index: number): Promise<void> {
        await this.jobCard(index).scrollIntoViewIfNeeded();
    }

    async isPaginationVisible(): Promise<boolean> {
        return this.paginationOfResults.isVisible();
    }

    async getResultPageButtonCount(): Promise<number> {
        return this.resultPages.count();
    }

    async clickResultPage(index: number): Promise<void> {
        await this.resultPage(index).click();
    }
}