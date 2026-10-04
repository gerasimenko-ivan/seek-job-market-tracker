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
    url: string | null;
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

        const relativeUrl = await job
            .locator('a[href*="/job/"]')
            .first()
            .getAttribute('href');

        const url = relativeUrl
            ? new URL(relativeUrl, this.page.url()).toString()
            : null;


        this.jobPage = {
            title,
            description,
            advertiser: await job.getByTestId('advertiser-name').innerText(),
            location: await job.getByTestId('job-detail-location').innerText(),
            keywords,
            classification: classifyJobKeywords(keywords),
            url,
        };

        return this.jobPage;
    }

    async getJobPage(): Promise<JobPage> {
        return this.jobPage ?? (await this.updateJobPage());
    }

    async print(): Promise<void> {
        const job = await this.getJobPage();
        const previewMaxLength = 100;
        const descriptionPreview =
            job.description.slice(0, previewMaxLength).replaceAll('\n', ' ') +
            (job.description.length > previewMaxLength ? '...' : '');

        const output = `{
  Title: ${job.title}
  Description: '${descriptionPreview}'
  Keywords: [ ${job.keywords.join(', ')} ]
  Classification: {
    score: ${job.classification.score}
    topKeywords: [ ${job.classification.topKeywords.join(', ')} ]
    bottomKeywords: [ ${job.classification.bottomKeywords.join(', ')} ]
  }
  URL: ${job.url ?? 'N/A'}
}`;

        console.log(output);
    }
}