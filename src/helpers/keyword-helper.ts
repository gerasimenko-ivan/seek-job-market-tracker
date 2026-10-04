import { JOB_KEYWORD } from '../types/seek-search';

export function extractJobKeywords(text: string): JOB_KEYWORD[] {
    const normalizedText = normalizeKeywordText(text);

    return Object.values(JOB_KEYWORD).filter((keyword) => {
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
