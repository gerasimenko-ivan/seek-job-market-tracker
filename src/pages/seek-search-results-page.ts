import { Locator, Page } from '@playwright/test';

export interface JobCard {
    title: string;
}

export class SeekSearchResultsPage {
    private readonly page: Page;

    readonly jobCards: Locator;
    readonly jobTitle = (index: number) =>
        this.jobCards.nth(index).getByTestId('jobTitle');

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
        }
    }

    // async getJobCards(): Promise<JobCard[]> {
    //     // read all currently loaded cards
    // }
}