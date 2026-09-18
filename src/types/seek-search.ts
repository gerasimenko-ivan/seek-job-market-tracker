export enum JOB_TYPE {
    FULL_TIME = 'Full time',
    PART_TIME = 'Part time',
}

export interface SearchParams {
    keywords: string[];
    location: string;
    type: JOB_TYPE;
}

export interface SearchPageState {
    url: string;
    keywords: string;
    location: string;
    totalJobsMessage: string | null;
    totalJobs: number;
}