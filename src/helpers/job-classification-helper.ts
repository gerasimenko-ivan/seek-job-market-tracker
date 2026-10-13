export interface KeywordRelevance<T extends string> {
    score: number;
    /** Up to 3 keywords with the highest positive weights */
    topKeywords: T[];
    /** Up to 3 keywords with the lowest negative weights */
    bottomKeywords: T[];
}

interface GetKeywordRelevance<T extends string> {
    keywords: T[];
    weights: Record<T, number>;
}

export function getKeywordRelevance<T extends string>(param: GetKeywordRelevance<T>): KeywordRelevance<T> { //keywords: QA_JOB_KEYWORD[]): KeywordRelevance {
    const { keywords, weights } = param;

    const scoredKeywords = keywords.map((keyword) => ({
        keyword,
        weight: weights[keyword],
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