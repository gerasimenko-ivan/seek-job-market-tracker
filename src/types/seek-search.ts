export interface SearchPageState {
    url: string;
    keywords: string;
    location: string;
    totalJobsMessage: string | null;
    totalJobs: number;
}