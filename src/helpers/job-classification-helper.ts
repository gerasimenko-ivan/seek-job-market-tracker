import { JOB_KEYWORD } from '../types/seek-search.js';

export interface KeywordsClassification {
    score: number;
    /** Up to 3 keywords with the highest positive weights */
    topKeywords: JOB_KEYWORD[];
    /** Up to 3 keywords with the lowest negative weights */
    bottomKeywords: JOB_KEYWORD[];
}

export const JOB_KEYWORD_WEIGHT = {
    STRONG_MATCH: 11,
    GOOD_MATCH: 7,
    RELEVANT: 5,
    SUPPLEMENTARY: 3,
    MINOR_MATCH: 1,
    NEUTRAL: 0,
    MISMATCH: -5,
    STRONG_MISMATCH: -11,
} as const;

const {
    STRONG_MATCH,
    GOOD_MATCH,
    RELEVANT,
    SUPPLEMENTARY,
    MINOR_MATCH,
    NEUTRAL,
    MISMATCH,
    STRONG_MISMATCH,
} = JOB_KEYWORD_WEIGHT;

export const JOB_KEYWORD_WEIGHTS: Record<JOB_KEYWORD, number> = {
    // Programming languages
    [JOB_KEYWORD.TYPESCRIPT]: STRONG_MATCH,
    [JOB_KEYWORD.JAVASCRIPT]: GOOD_MATCH,
    [JOB_KEYWORD.JAVA]: GOOD_MATCH,
    [JOB_KEYWORD.C_SHARP]: GOOD_MATCH,
    [JOB_KEYWORD.PYTHON]: RELEVANT,

    // Test automation
    [JOB_KEYWORD.PLAYWRIGHT]: STRONG_MATCH,
    [JOB_KEYWORD.SELENIUM]: GOOD_MATCH,
    [JOB_KEYWORD.CYPRESS]: RELEVANT,
    [JOB_KEYWORD.TEST_NG]: RELEVANT,
    [JOB_KEYWORD.J_UNIT]: RELEVANT,
    [JOB_KEYWORD.TRICENTIS_TOSCA]: RELEVANT,
    [JOB_KEYWORD.CUCUMBER]: NEUTRAL,
    [JOB_KEYWORD.ESPRESSO]: MISMATCH,
    [JOB_KEYWORD.UI_AUTOMATOR]: MISMATCH,
    [JOB_KEYWORD.APPIUM]: MISMATCH,

    // Test tools
    [JOB_KEYWORD.POSTMAN]: GOOD_MATCH,
    [JOB_KEYWORD.JMETER]: GOOD_MATCH,

    // Test management & defect tracking
    [JOB_KEYWORD.JIRA]: GOOD_MATCH,
    [JOB_KEYWORD.HP_ALM]: RELEVANT,
    [JOB_KEYWORD.TEST_RAIL]: RELEVANT,
    [JOB_KEYWORD.XRAY]: NEUTRAL,
    [JOB_KEYWORD.ZEPHYR]: NEUTRAL,
    [JOB_KEYWORD.QTEST]: NEUTRAL,

    // Technical skills
    [JOB_KEYWORD.API]: GOOD_MATCH,
    [JOB_KEYWORD.SQL]: GOOD_MATCH,

    // Version control & collaboration
    [JOB_KEYWORD.GIT]: GOOD_MATCH,
    [JOB_KEYWORD.GITHUB]: STRONG_MATCH,
    [JOB_KEYWORD.GITLAB]: STRONG_MATCH,

    // CI/CD & DevOps
    [JOB_KEYWORD.CI_CD]: GOOD_MATCH,
    [JOB_KEYWORD.JENKINS]: RELEVANT,
    [JOB_KEYWORD.BAMBOO]: RELEVANT,
    [JOB_KEYWORD.GITHUB_ACTIONS]: RELEVANT,
    [JOB_KEYWORD.GITLAB_CI]: RELEVANT,
    [JOB_KEYWORD.AZURE_DEVOPS]: RELEVANT,

    // Documentation & collaboration
    [JOB_KEYWORD.CONFLUENCE]: GOOD_MATCH,
    [JOB_KEYWORD.SHAREPOINT]: RELEVANT,
    [JOB_KEYWORD.NOTION]: SUPPLEMENTARY,

    // Platforms & environments
    [JOB_KEYWORD.UI_TESTING]: GOOD_MATCH,
    [JOB_KEYWORD.MOBILE]: RELEVANT,
    [JOB_KEYWORD.MOBILE_APP_TESTING]: RELEVANT,
    [JOB_KEYWORD.ANDROID]: RELEVANT,
    [JOB_KEYWORD.IOS]: RELEVANT,
    [JOB_KEYWORD.HARDWARE]: MISMATCH,

    // Enterprise software / business systems / environments
    [JOB_KEYWORD.DOT_NET]: RELEVANT,
    [JOB_KEYWORD.NODE_JS]: GOOD_MATCH,
    [JOB_KEYWORD.JAVA_SPRINGBOOT]: SUPPLEMENTARY,
    [JOB_KEYWORD.SAP]: NEUTRAL,
    [JOB_KEYWORD.ERP]: NEUTRAL,

    // Testing practices
    [JOB_KEYWORD.TEST_CASES]: GOOD_MATCH,
    [JOB_KEYWORD.TEST_PLANS]: GOOD_MATCH,
    [JOB_KEYWORD.UAT]: GOOD_MATCH,
    [JOB_KEYWORD.AI_DRIVEN_TESTING]: GOOD_MATCH,
    [JOB_KEYWORD.AI_ASSISTED_TESTING]: GOOD_MATCH,

    // Job seniority / role
    [JOB_KEYWORD.SENIOR]: NEUTRAL,
    [JOB_KEYWORD.LEAD]: NEUTRAL,
    [JOB_KEYWORD.TEST_ANALYST]: RELEVANT,
    [JOB_KEYWORD.ANALYST_TESTER]: RELEVANT,
    [JOB_KEYWORD.TEST_MANAGER]: RELEVANT,

    // Employment conditions
    [JOB_KEYWORD.FIXED_TERM]: NEUTRAL,
    [JOB_KEYWORD.PERMANENT]: NEUTRAL,

    // Other job characteristics
    [JOB_KEYWORD.SUPPORT247]: STRONG_MISMATCH,
    [JOB_KEYWORD.CERTIFICATE]: STRONG_MISMATCH,

    // Non-QA / non-IT technologies
    [JOB_KEYWORD.SOLID_WORKS_CAD]: STRONG_MISMATCH,
    [JOB_KEYWORD.ADOBE_INDESIGN]: STRONG_MISMATCH,
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