import { JOB_KEYWORD } from '../types/seek-search';

export interface KeywordsClassification {
    score: number;
    /** Up to 3 keywords with the highest positive weights */
    topKeywords: JOB_KEYWORD[];
    /** Up to 3 keywords with the lowest negative weights */
    bottomKeywords: JOB_KEYWORD[];
}

export const JOB_KEYWORD_WEIGHTS: Record<JOB_KEYWORD, number> = {
    // Programming languages
    [JOB_KEYWORD.TYPESCRIPT]: 11,
    [JOB_KEYWORD.JAVASCRIPT]: 7,
    [JOB_KEYWORD.JAVA]: 7,
    [JOB_KEYWORD.C_SHARP]: 7,
    [JOB_KEYWORD.PYTHON]: 5,

    // Test automation
    [JOB_KEYWORD.PLAYWRIGHT]: 11,
    [JOB_KEYWORD.SELENIUM]: 7,
    [JOB_KEYWORD.CYPRESS]: 5,
    [JOB_KEYWORD.TRICENTIS_TOSCA]: 5,
    [JOB_KEYWORD.ESPRESSO]: -5,
    [JOB_KEYWORD.UI_AUTOMATOR]: -5,
    [JOB_KEYWORD.APPIUM]: -5,

    // Test tools
    [JOB_KEYWORD.POSTMAN]: 7,
    [JOB_KEYWORD.JMETER]: 7,

    // Test management & defect tracking
    [JOB_KEYWORD.JIRA]: 7,
    [JOB_KEYWORD.HP_ALM]: 5,
    [JOB_KEYWORD.TEST_RAIL]: 5,

    // Technical skills
    [JOB_KEYWORD.API]: 7,
    [JOB_KEYWORD.SQL]: 7,

    // Version control & collaboration
    [JOB_KEYWORD.GIT]: 7,
    [JOB_KEYWORD.GITHUB]: 11,
    [JOB_KEYWORD.GITLAB]: 11,

    // CI/CD & DevOps
    [JOB_KEYWORD.CI_CD]: 7,
    [JOB_KEYWORD.JENKINS]: 5,
    [JOB_KEYWORD.GITHUB_ACTIONS]: 5,
    [JOB_KEYWORD.GITLAB_CI]: 5,
    [JOB_KEYWORD.AZURE_DEVOPS]: 5,

    // Documentation & collaboration
    [JOB_KEYWORD.CONFLUENCE]: 7,
    [JOB_KEYWORD.SHAREPOINT]: 5,
    [JOB_KEYWORD.NOTION]: 3,

    // Platforms & environments
    [JOB_KEYWORD.UI_TESTING]: 7,
    [JOB_KEYWORD.MOBILE]: 5,
    [JOB_KEYWORD.MOBILE_APP_TESTING]: 5,
    [JOB_KEYWORD.ANDROID]: 5,
    [JOB_KEYWORD.IOS]: 5,
    [JOB_KEYWORD.HARDWARE]: -5,

    // Enterprise software / business systems
    [JOB_KEYWORD.DOT_NET]: 5,
    [JOB_KEYWORD.SAP]: 0,
    [JOB_KEYWORD.ERP]: 0,

    // Testing practices
    [JOB_KEYWORD.TEST_CASES]: 7,
    [JOB_KEYWORD.TEST_PLANS]: 7,
    [JOB_KEYWORD.UAT]: 7,
    [JOB_KEYWORD.AI_DRIVEN_TESTING]: 7,

    // Job seniority / role
    [JOB_KEYWORD.SENIOR]: 0,
    [JOB_KEYWORD.LEAD]: 0,
    [JOB_KEYWORD.TEST_ANALYST]: 5,
    [JOB_KEYWORD.ANALYST_TESTER]: 5,
    [JOB_KEYWORD.TEST_MANAGER]: 5,

    // Employment conditions
    [JOB_KEYWORD.FIXED_TERM]: 0,
    [JOB_KEYWORD.PERMANENT]: 0,

    // Other job characteristics
    [JOB_KEYWORD.SUPPORT247]: -11,
    [JOB_KEYWORD.CERTIFICATE]: -11,

    // Non-QA / non-IT technologies
    [JOB_KEYWORD.SOLID_WORKS_CAD]: -11,
    [JOB_KEYWORD.ADOBE_INDESIGN]: -11,
};

export function classifyJobKeywords(keywords: JOB_KEYWORD[]): KeywordsClassification {
    const scoredKeywords = keywords.map((keyword) => ({
        keyword,
        weight: JOB_KEYWORD_WEIGHTS[keyword],
    }));

    const score = scoredKeywords.reduce(
        (total, item) => total + item.weight,
        0,
    );

    const topKeywords = [...scoredKeywords]
        .filter(({ weight }) => weight > 0)
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 3)
        .map((item) => item.keyword);

    const bottomKeywords = [...scoredKeywords]
        .filter(({ weight }) => weight < 0)
        .sort((a, b) => a.weight - b.weight)
        .slice(0, 3)
        .map((item) => item.keyword);

    return {
        score,
        topKeywords,
        bottomKeywords,
    };
}