import { JOB_KEYWORD } from '../types/seek-search';

export function extractJobKeywords(text: string): JOB_KEYWORD[] {
    const normalizedText = text.toLowerCase().replace(/-/g, ' ');

    return Object.values(JOB_KEYWORD).filter((keyword) => {
        const normalizedKeyword = keyword.toLowerCase();

        if (isSimpleWord(normalizedKeyword)) {
            return new RegExp(`\\b${escapeRegExp(normalizedKeyword)}\\b`).test(
                normalizedText,
            );
        }

        return normalizedText.includes(normalizedKeyword);
    });
}

function isSimpleWord(keyword: string): boolean {
    return /^[a-z0-9]+$/i.test(keyword);
}

function escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
