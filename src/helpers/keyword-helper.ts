interface ExtractJobKeywords<T extends string> {
    text: string;
    keywords: T[];
}

export function extractJobKeywords<T extends string>(param: ExtractJobKeywords<T>): T[] {
    const { text, keywords } = param;
    const normalizedText = normalizeKeywordText(text);

    return Object.values(keywords).filter((keyword) => {
        const normalizedKeyword = normalizeKeywordText(keyword);

        return new RegExp(
            `(?<![a-z0-9])${escapeRegExp(normalizedKeyword)}(?![a-z0-9])`,
            'i',
        ).test(normalizedText);
    });
}

function normalizeKeywordText(text: string): string {
    return text.toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
}

function escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
