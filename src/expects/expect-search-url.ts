import { expect, Page } from '@playwright/test';
import { SearchParams } from '../types/seek-search';
import { forUrl } from '../helpers/string-helper';

export interface ExpectSearchUrlParams {
    page: Page;
    search: SearchParams;
}

export async function expectSearchUrl(params: ExpectSearchUrlParams): Promise<void> {
    const { page, search } = params;
    const { keywords, location, type, classification } = search;

    const urlSubfolder =
        `${keywords.join('-')}-jobs` +
        (classification
            ? (`-in-${forUrl({ text: classification.category, lowerCase: true })}`
                + (classification.subcategory
                    ? `/${forUrl({ text: classification.subcategory, lowerCase: true })}`
                    : ''))
            : '') +
        `/in-${forUrl({ text: location })}/` +
        forUrl({ text: type, lowerCase: true });

    await expect(page).toHaveURL(new RegExp(urlSubfolder));
}
