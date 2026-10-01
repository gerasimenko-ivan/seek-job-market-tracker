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

    readonly jobTitle = (index: number) =>
        this.jobCard(index).getByTestId('jobTitle');

    readonly jobCompany = (index: number) =>
        this.jobCard(index).getByTestId('jobCompany');

    readonly jobLocation = (index: number) =>
        this.jobCard(index).getByTestId('jobCardLocation');

    constructor(page: Page) {
        this.page = page;

        this.jobCards = this.page.getByTestId('normalJob');
    }

    async getJobCardCount(): Promise<number> {
        return this.jobCards.count();
    }

    async getJobCard(index: number): Promise<JobCard> {
        return {
            title: await this.jobTitle(index).innerText(),
            company: await this.jobCompany(index).innerText(),
            location: await this.jobLocation(index).innerText(),
        };
    }

    // async getJobCards(): Promise<JobCard[]> {
    //     // read all currently loaded cards
    // }
}