import { Locator, Page } from '@playwright/test';
import { locationTypeFromText } from '../helpers/location-helper';
import { LOCATION_TYPE } from '../types/seek-search';

export interface JobCard {
    title: string;
    company: string;
    location: string;
    locationType?: LOCATION_TYPE;
    workArrangement?: string;
}

export class SeekSearchResultsPage {
    private readonly page: Page;

    readonly jobCards: Locator;

    readonly jobCard = (index: number) => this.jobCards.nth(index);

    constructor(page: Page) {
        this.page = page;

        this.jobCards = this.page.getByTestId('normalJob');
    }

    async getJobCardCount(): Promise<number> {
        return this.jobCards.count();
    }

    async getJobCard(index: number): Promise<JobCard> {
        const jobCard = this.jobCard(index);
        const location = await jobCard
            .getByTestId('jobCardLocation')
            .innerText();

        const workArrangement = jobCard.locator('[data-testid="work-arrangement"]');

        const workArrangementText =
            await workArrangement.isVisible()
                ? await workArrangement.innerText()
                : undefined;

        return {
            title: await jobCard.getByTestId('jobTitle').innerText(),
            company: await jobCard.getByTestId('jobCompany').innerText(),
            location,
            locationType: locationTypeFromText(location),
            workArrangement: workArrangementText,
        };
    }

    async getJobCards(): Promise<JobCard[]> {
        const count = await this.getJobCardCount();

        return Promise.all(
            Array.from({ length: count }, (_, index) => this.getJobCard(index)),
        );
    }

    async scrollToJobCard(index: number): Promise<void> {
        await this.jobCard(index).scrollIntoViewIfNeeded();
    }
}