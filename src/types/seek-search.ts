export enum JOB_TYPE {
    FULL_TIME = 'Full time',
    PART_TIME = 'Part time',
}

export enum JOB_CATEGORY {
    ICT = 'Information & Communication Technology',
    MTL = 'Manufacturing, Transport & Logistics',
    HEALTH = 'All Healthcare & Medical',
}

export enum JOB_ICT_SUBCATEGORY {
    TESTING_AND_QUALITY_ASSURANCE = 'Testing & Quality Assurance',
}

export enum JOB_MTL_SUBCATEGORY {
    QUALITY_ASSURANCE_AND_CONTROL = 'Quality Assurance & Control',
}

export enum JOB_HEALTH_SUBCATEGORY {
    CLINICAL_MEDICAL_RESEARCH = 'Clinical/Medical Research',
}

export interface JobClassification {
    category: JOB_CATEGORY;
    subcategory:
        JOB_ICT_SUBCATEGORY | JOB_MTL_SUBCATEGORY | JOB_HEALTH_SUBCATEGORY;
}

export enum SALARY {
    NZD_70K = '$70K',
    NZD_80K = '$80K',
    NZD_100K = '$100K',
    NZD_120K = '$120K',
    NZD_150K = '$150K',
}

export interface SearchParams {
    keywords: string[];
    location: string;
    salary?: {
        min?: SALARY;
        max?: SALARY;
    }
    classification?: JobClassification;
    type: JOB_TYPE;
}

export interface SearchPageState {
    url: string;
    keywords: string;
    location: string;
    totalJobsMessage: string | null;
    totalJobs: number;
}