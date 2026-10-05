import { expect, test } from '@playwright/test';
import { SeekSearchPage } from '../src/pages/seek-search-page';
import { SeekSearchResultsPage } from '../src/pages/seek-search-results-page';
import { expectSearchUrl } from '../src/expects/expect-search-url';
import { expectJobsCountMessage } from '../src/expects/expect-jobs-count';
import { JOB_CATEGORY, JOB_ICT_SUBCATEGORY, JOB_TYPE, SearchParams } from '../src/types/seek-search';
import { JobPage, SeekJobPage } from '../src/pages/seek-job-page';

test('SEEK search and job classification', async ({ page }) => {
    test.setTimeout(40000);

    const seekSearch = new SeekSearchPage(page);
    const seekResult = new SeekSearchResultsPage(page);

    const search: SearchParams = {
        // keywords: ['typescript', 'playwright'],
        keywords: ['qa'],
        location: 'All New Zealand',
        type: JOB_TYPE.FULL_TIME,
        classification: {
            category: JOB_CATEGORY.ICT,
            subcategory: JOB_ICT_SUBCATEGORY.TESTING_AND_QUALITY_ASSURANCE,
        },
    };
    await seekSearch.search(search);

    await expectSearchUrl({ page, search });

    const searchPageState = await seekSearch.getSearchState({
        printLogs: true,
    });

    expectJobsCountMessage(searchPageState);

    const jobCardCount = await seekResult.getJobCardCount();

    console.log(`jobCardCount: ${jobCardCount}`);

    expect(jobCardCount).toBe(searchPageState.totalJobs);
    expect(jobCardCount).toBeGreaterThan(0);

    const jobPage = new SeekJobPage(page);
    const jobPages: JobPage[] = [];

    for (let i = 0; i < jobCardCount; i++) {
        await seekResult.clickJobCard(i);
        const job = await jobPage.updateJobPage();
        jobPages.push(job);
    }

    jobPages.sort((a, b) => a.classification.score - b.classification.score);
    jobPages.forEach((job) => { SeekJobPage.printJobPage(job); })
});