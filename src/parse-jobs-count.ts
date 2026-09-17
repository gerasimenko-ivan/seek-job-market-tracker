export function parseJobsCount(totalJobsMessage: string | null): number {
    if (totalJobsMessage === null) {
        throw new Error('Total jobs message was not found');
    }

    return parseInt(totalJobsMessage.replace(/,/g, ''), 10);
}