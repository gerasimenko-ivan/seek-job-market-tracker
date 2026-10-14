import { expect, test } from '@playwright/test';
import { SeekSearchPage } from '../src/pages/seek-search-page';
import { SeekSearchResultsPage } from '../src/pages/seek-search-results-page';
import { expectSearchUrl } from '../src/expects/expect-search-url';
import { expectJobsCountMessage } from '../src/expects/expect-jobs-count';
import {
    JOB_CATEGORY,
    JOB_ICT_SUBCATEGORY,
    JOB_TYPE,
    SALARY_HOURLY,
    SALARY_PERIOD,
    SearchParams,
} from '../src/types/seek-search';
import { type JobPage, SeekJobPage } from '../src/pages/seek-job-page';
import { QA_JOB_KEYWORD, QA_JOB_KEYWORD_WEIGHTS } from '../src/data/keyword-qa';

test('SEEK search and job classification: qa', async ({ page }) => {
    test.setTimeout(100000);

    const search: SearchParams = {
        // keywords: ['typescript', 'playwright'],
        keywords: ['qa'],
        location: 'All New Zealand',
        type: JOB_TYPE.FULL_TIME,
        salary: {
            period: SALARY_PERIOD.HOURLY,
            from: SALARY_HOURLY.NZD_35,
            // from: SALARY_HOURLY.NZD_175,
        },
        classification: {
            category: JOB_CATEGORY.ICT,
            subcategory: JOB_ICT_SUBCATEGORY.TESTING_AND_QUALITY_ASSURANCE,
        },
    };

    const seekSearch = new SeekSearchPage(page);
    const seekResults = new SeekSearchResultsPage(page);
    const seekJob = new SeekJobPage<QA_JOB_KEYWORD>({
        page,
        keywordProfile: {
            keywords: QA_JOB_KEYWORD,
            weights: QA_JOB_KEYWORD_WEIGHTS,
        },
    });

    await seekSearch.search(search);

    await expectSearchUrl({ page, search });

    const searchPageState = await seekSearch.getSearchState({
        printLogs: true,
    });

    expectJobsCountMessage(searchPageState);

    const firstPageJobCardCount = await seekResults.getJobCardCount();
    const isPaginationVisible = await seekResults.isPaginationVisible();
    const resultPageButtonCount = await seekResults.getResultPageButtonCount();
    const resultPageCount = isPaginationVisible ? resultPageButtonCount : 1;

    expect(firstPageJobCardCount).toBeGreaterThan(0);

    console.log(`firstPageJobCardCount: ${firstPageJobCardCount}`);
    console.log(`isPaginationVisible: ${isPaginationVisible}`);
    console.log(`resultPageButtonCount: ${resultPageButtonCount}`);
    console.log(`Result pages: ${resultPageCount}`);

    const jobPages: JobPage[] = [];

    for (let pageIndex = 0; pageIndex < resultPageCount; pageIndex++) {
        if (pageIndex > 0) {
            console.log(`Processing page ${pageIndex + 1}`);

            await seekResults.clickResultPage(pageIndex);
            await page.waitForTimeout(1000); // this wait required for job cards to update
        }

        let jobCardCount = await seekResults.getJobCardCount();

        console.log(`Job cards on page ${pageIndex + 1}: ${jobCardCount}`);

        for (let jobIndex = 0; jobIndex < jobCardCount; jobIndex++) {
            console.log(`Click job card: ${jobIndex + 1}/${jobCardCount}`);

            await seekResults.clickJobCard(jobIndex);

            const job = await seekJob.updateJobPage();
            jobPages.push(job);
        }
    }

    jobPages.sort((a, b) => a.keywordRelevance.score - b.keywordRelevance.score);
    jobPages.forEach((job) => { SeekJobPage.printJobPage(job); })
});