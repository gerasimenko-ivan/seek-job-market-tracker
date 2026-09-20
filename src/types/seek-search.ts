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

export type JobClassification =
    | {
          category: JOB_CATEGORY.ICT;
          subcategory?: JOB_ICT_SUBCATEGORY;
      }
    | {
          category: JOB_CATEGORY.MTL;
          subcategory?: JOB_MTL_SUBCATEGORY;
      }
    | {
          category: JOB_CATEGORY.HEALTH;
          subcategory?: JOB_HEALTH_SUBCATEGORY;
      };

export enum SALARY_PERIOD {
    ANNUALLY = 'Annually',
    // MONTHLY = 'Monthly',
    HOURLY = 'Hourly',
}

export enum SALARY_ANNUALLY {
    NZD_70K = '$70K',
    NZD_80K = '$80K',
    NZD_100K = '$100K',
    NZD_120K = '$120K',
    NZD_150K = '$150K',
    NZD_200K = '$200K',
    NZD_250K = '$250K',
    NZD_350K = '$350K',
    NZD_350KPlus = '$350K+',
}

export enum SALARY_HOURLY {
    NZD_60 = '$60',
    NZD_75 = '$75',
    NZD_100 = '$100',
    NZD_125 = '$125',
    NZD_175 = '$175',
}

export type SalaryParams =
    | {
          period: SALARY_PERIOD.ANNUALLY;
          from?: SALARY_ANNUALLY;
          to?: SALARY_ANNUALLY;
      }
    | {
          period: SALARY_PERIOD.HOURLY;
          from?: SALARY_HOURLY;
          to?: SALARY_HOURLY;
      };

export interface SearchParams {
    keywords: string[];
    location: string;
    salary?: SalaryParams;
    classification?: JobClassification;
    type: JOB_TYPE;
}

export interface SearchPageState {
    url: string;
    keywords: string;
    location: string;
    salary?: string | null;
    classification: string | null;
    type: string | null;
    totalJobsMessage: string | null;
    totalJobs: number;
}