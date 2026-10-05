export enum JOB_TYPE {
    FULL_TIME = 'Full time',
    PART_TIME = 'Part time',
}

export enum JOB_CATEGORY {
    ICT = 'Information & Communication Technology',
    MTL = 'Manufacturing, Transport & Logistics',
    HEALTH = 'Healthcare & Medical',
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
    NZD_35 = '$35',
    NZD_40 = '$40',
    NZD_50 = '$50',
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

export type SearchParamsWithoutSalary = Omit<SearchParams, 'salary'>;

export type SearchParamsWithSalary = SearchParamsWithoutSalary & {
    salary: SalaryParams;
};

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

export enum FILTER_MESSAGE {
    NO_RESULTS = 'No matching search results',
}

export enum LOCATION_TYPE {
    AUCKLAND = 'Auckland',
    BAY_OF_PLENTY = 'Bay of Plenty',
    CANTERBURY = 'Canterbury',
    NORTHLAND = 'Northland',
    OTAGO = 'Otago',
    SOUTHLAND = 'Southland',
    TARANAKI = 'Taranaki',
    WAIKATO = 'Waikato',
    WELLINGTON = 'Wellington',
}

export enum WORK_ARRANGEMENT {
    HYBRID = 'Hybrid',
    REMOTE = 'Remote',
}

export enum JOB_KEYWORD {
    // Programming languages
    TYPESCRIPT = 'TypeScript',
    JAVASCRIPT = 'JavaScript',
    JAVA = 'Java',
    C_SHARP = 'C#',
    PYTHON = 'Python',

    // Test automation
    PLAYWRIGHT = 'Playwright',
    SELENIUM = 'Selenium',
    CYPRESS = 'Cypress',
    TEST_NG = 'TestNG',
    J_UNIT = 'JUnit',
    TRICENTIS_TOSCA = 'Tricentis TOSCA',
    ESPRESSO = 'Espresso', // Android testing framework
    UI_AUTOMATOR = 'UI Automator', // black-box UI testing on Android
    APPIUM = 'Appium', // UI automation of many app platforms, including mobile (iOS, Android, ...)

    // Test tools
    POSTMAN = 'Postman',
    JMETER = 'JMeter',

    // Test management & defect tracking
    JIRA = 'Jira',
    HP_ALM = 'HP ALM',
    TEST_RAIL = 'TestRail',

    // Technical skills
    API = 'API',
    SQL = 'SQL',

    // Version control & collaboration
    GIT = 'Git',
    GITHUB = 'GitHub',
    GITLAB = 'GitLab',

    // CI/CD & DevOps
    CI_CD = 'CI/CD',
    JENKINS = 'Jenkins',
    GITHUB_ACTIONS = 'GitHub Actions',
    GITLAB_CI = 'GitLab CI',
    AZURE_DEVOPS = 'Azure DevOps',

    // Documentation & collaboration
    CONFLUENCE = 'Confluence',
    SHAREPOINT = 'SharePoint',
    NOTION = 'Notion',

    // Platforms & environments
    UI_TESTING = 'UI testing',
    MOBILE = 'Mobile',
    MOBILE_APP_TESTING = 'Mobile app testing',
    ANDROID = 'Android',
    IOS = 'iOS',
    HARDWARE = 'hardware',

    // Enterprise software / business systems
    DOT_NET = '.NET',
    NODE_JS = 'NodeJS',
    SAP = 'SAP',
    ERP = 'ERP',

    // Testing practices
    TEST_CASES = 'test cases',
    TEST_PLANS = 'test plans',
    UAT = 'UAT',
    AI_DRIVEN_TESTING = 'AI-driven testing',
    AI_ASSISTED_TESTING = 'AI-assisted testing',

    // Job seniority / role
    SENIOR = 'senior',
    LEAD = 'lead',
    TEST_ANALYST = 'test analyst',
    ANALYST_TESTER = 'analyst tester',
    TEST_MANAGER = 'test manager',

    // Employment conditions
    FIXED_TERM = 'fixed term',
    PERMANENT = 'permanent',

    // Other job characteristics
    SUPPORT247 = '24 x 7 on-call support',
    CERTIFICATE = 'Relevant technology certification',

    // Non-QA / non-IT technologies
    SOLID_WORKS_CAD = 'SolidWorks CAD',
    ADOBE_INDESIGN = 'Adobe InDesign',
}