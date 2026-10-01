import { Locator, Page } from '@playwright/test';

export interface JobCard {
    title: string;
    company: string;
    location: string;
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

        return {
            title: await jobCard.getByTestId('jobTitle').innerText(),
            company: await jobCard.getByTestId('jobCompany').innerText(),
            location: await jobCard.getByTestId('jobCardLocation').innerText(),
        };
    }

    async getJobCards(): Promise<JobCard[]> {
        const count = await this.getJobCardCount();

        return Promise.all(
            Array.from({ length: count }, (_, index) => this.getJobCard(index)),
        );
    }
}