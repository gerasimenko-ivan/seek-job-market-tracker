import { Locator, Page } from '@playwright/test';
import { JOB_KEYWORD } from '../types/seek-search';
import { extractJobKeywords } from '../helpers/keyword-helper';
import { classifyJobKeywords, KeywordsClassification } from '../helpers/job-classification-helper';

export interface JobPage {
    title: string;
    advertiser: string;
    location: string;
    salary?: {
        disclosed: boolean;
        value?: {
            min: number;
            max: number;
        };
    };
    description: string;
    keywords: JOB_KEYWORD[];
    classification: KeywordsClassification;
}

export class SeekJobPage {
    private jobPage?: JobPage;

    readonly page: Page;

    readonly job: Locator;

    readonly salaryUndisclosedIcon: Locator;

    constructor(page: Page) {
        this.page = page;

        this.job = this.page.getByTestId('jobDetailsPage');

        this.salaryUndisclosedIcon = this.job.locator(
            '[id="salaryUndisclosedIconId"]',
        );
    }

    async updateJobPage(): Promise<JobPage> {
        const job = this.job;

        const title = await job.getByTestId('job-detail-title').innerText();
        const description = await job.getByTestId('jobAdDetails').innerText();
        const keywords = extractJobKeywords(`${title} ${description}`);

        this.jobPage = {
            title,
            description,
            advertiser: await job.getByTestId('advertiser-name').innerText(),
            location: await job.getByTestId('job-detail-location').innerText(),
            keywords,
            classification: classifyJobKeywords(keywords),
        };

        return this.jobPage;
    }

    async getJobPage(): Promise<JobPage> {
        return this.jobPage ?? (await this.updateJobPage());
    }

    async print(): Promise<void> {
        const job = await this.getJobPage();
        const descriptionPreview = job.description
            .slice(0, 100)
            .replaceAll('\n', ' ');

        console.log('{');
        console.log(`  Title: ${job.title}`);
        console.log(
            `  Description: '${descriptionPreview}${
                job.description.length > 100 ? "...'" : "'"
            }`,
        );
        console.log(`  Keywords: [ ${job.keywords.join(', ')} ]`);
        console.log('  Classification: {');
        console.log(`    score: ${job.classification.score}`);
        console.log(
            `    topKeywords: [ ${job.classification.topKeywords.join(', ')} ]`,
        );
        console.log(
            `    bottomKeywords: [ ${job.classification.bottomKeywords.join(', ')} ]`,
        );
        console.log('  }');
        console.log('}');
    }
}