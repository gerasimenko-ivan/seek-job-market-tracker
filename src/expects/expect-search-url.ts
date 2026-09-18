import { expect, Page } from '@playwright/test';
import { SearchParams } from '../types/seek-search';

export interface ExpectSearchUrlParams {
    page: Page;
    search: SearchParams;
}

export function expectSearchUrl(params: ExpectSearchUrlParams): void {
    const { page, search } = params;
    const { keywords, location, type } = search;

    const urlSubfolder =
        `${keywords.join('-')}-jobs/` +
        `in-${location.replaceAll(' ', '-')}/` +
        type.toLowerCase().replaceAll(' ', '-');

    expect(page).toHaveURL(new RegExp(urlSubfolder));
}
