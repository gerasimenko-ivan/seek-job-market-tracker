import { expect } from '@playwright/test';
import { SearchPageState } from '../types/seek-search';

export type ExpectJobsCountMessage = Pick<
    SearchPageState,
    'totalJobsMessage' | 'totalJobs'
>;

export function expectJobsCountMessage(param: ExpectJobsCountMessage): void {
    const { totalJobsMessage, totalJobs } = param;

    if (totalJobs === 0) {
        return;
    }

    expect(
        totalJobsMessage,
        'Total jobs message should contain the correctly formatted job count',
    ).toBe(
        `${totalJobs.toLocaleString('en-NZ')} job${totalJobs === 1 ? '' : 's'}`,
    );
}
