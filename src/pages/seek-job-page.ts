import { extractJobKeywords } from '../helpers/keyword-helper.js';
import { getKeywordRelevance } from '../helpers/job-classification-helper.js';
import { QA_JOB_KEYWORD, QA_JOB_KEYWORD_WEIGHTS } from '../data/keyword-qa.js';

import type { Locator, Page } from '@playwright/test';
import type { KeywordRelevance } from '../helpers/job-classification-helper.js';

export interface JobPage<T extends string> {
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
    keywords: T[];
    url: string | null;
    keywordRelevance: KeywordRelevance<T>;
}

export class SeekJobPage {
    private jobPage?: JobPage<QA_JOB_KEYWORD>;

    readonly page: Page;

    readonly job: Locator;

    readonly salaryUndisclosedIcon: Locator;

    constructor(page: Page) {
        this.page = page;

        this.job = page.getByTestId('jobDetailsPage');

        this.salaryUndisclosedIcon = this.job.locator(
            '[id="salaryUndisclosedIconId"]',
        );
    }

    async updateJobPage(): Promise<JobPage<QA_JOB_KEYWORD>> {
        const job = this.job;

        const title = await job.getByTestId('job-detail-title').innerText();
        const description = await job.getByTestId('jobAdDetails').innerText();
        const advertiser = await job.getByTestId('advertiser-name').innerText();
        const location = await job
            .getByTestId('job-detail-location')
            .innerText();
        const relativeUrl = await job
            .locator('a[href*="/job/"]')
            .first()
            .getAttribute('href');

        const keywords = extractJobKeywords({
            text: `${title} ${description}`,
            keywords: QA_JOB_KEYWORD,
        });

        const url = relativeUrl
            ? new URL(relativeUrl, this.page.url()).toString()
            : null;

        this.jobPage = {
            title,
            description,
            advertiser,
            location,
            keywords,
            url,
            keywordRelevance: getKeywordRelevance({
                keywords: keywords,
                weights: QA_JOB_KEYWORD_WEIGHTS,
            }),
        };

        return this.jobPage;
    }

    async getJobPage(): Promise<JobPage<QA_JOB_KEYWORD>> {
        return this.jobPage ?? (await this.updateJobPage());
    }

    static printJobPage(job: JobPage<QA_JOB_KEYWORD>): void {
        const previewMaxLength = 100;
        const descriptionPreview =
            job.description.slice(0, previewMaxLength).replaceAll('\n', ' ') +
            (job.description.length > previewMaxLength ? '...' : '');

        const output = `{
  Title: ${job.title}
  Description: '${descriptionPreview}'
  Location: ${job.location}
  Keywords: [ ${job.keywords.join(', ')} ]
  URL: ${job.url ?? 'N/A'}
  Keyword relevance: {
    score: ${job.keywordRelevance.score}
    topKeywords: [ ${job.keywordRelevance.topKeywords.join(', ')} ]
    bottomKeywords: [ ${job.keywordRelevance.bottomKeywords.join(', ')} ]
  }
}`;

        console.log(output);
    }

    async print(): Promise<void> {
        SeekJobPage.printJobPage(await this.getJobPage());
    }
}