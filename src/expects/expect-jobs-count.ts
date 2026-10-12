import { expect } from '@playwright/test';
import { FILTER_MESSAGE, type SearchPageState } from '../types/seek-search.js';

type ExpectJobsCountMessage = Pick<
    SearchPageState,
    'totalJobsMessage' | 'totalJobs'
>;

export function expectJobsCountMessage(param: ExpectJobsCountMessage): void {
    const { totalJobsMessage, totalJobs } = param;

    const expectedMessage =
        totalJobs === 0
            ? FILTER_MESSAGE.NO_RESULTS
            : `${totalJobs.toLocaleString('en-NZ')} job${totalJobs === 1 ? '' : 's'}`;

    expect(
        totalJobsMessage,
        'Total jobs message should match the expected job count',
    ).toBe(expectedMessage);
}
