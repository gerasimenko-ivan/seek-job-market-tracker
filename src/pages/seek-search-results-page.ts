import { Locator, Page } from '@playwright/test';
import { locationTypeFromText } from '../helpers/location-helper';
import { JOB_KEYWORD, LOCATION_TYPE, WORK_ARRANGEMENT } from '../types/seek-search';
import { workArrangementFromText } from '../helpers/work-arrangement-helper';
import { extractJobKeywords } from '../helpers/keyword-helper';

export interface JobCard {
    title: string;
    company: string;
    location: string;
    locationType: LOCATION_TYPE;
    workArrangement?: WORK_ARRANGEMENT;
    shortDescription: string;
    keywords: JOB_KEYWORD[];
}

export class SeekSearchResultsPage {
    private readonly page: Page;

    readonly jobCards: Locator;

    readonly jobCard = (index: number) => this.jobCards.nth(index);

    constructor(page: Page) {
        this.page = page;

        this.jobCards = this.page.locator('[data-testid="job-card"]');
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
            keywords: extractJobKeywords(`${title} ${shortDescription}`),
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
}