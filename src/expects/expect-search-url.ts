import { expect } from '@playwright/test';
import { textForUrl, moneyForUrl, salaryPeriodForUrl } from '../helpers/string-helper.js';

import type { Page } from '@playwright/test';
import type { SearchParams } from '../types/seek-search.js';

export interface ExpectSearchUrlParams {
    page: Page;
    search: SearchParams;
}

export async function expectSearchUrl(params: ExpectSearchUrlParams): Promise<void> {
    const { page, search } = params;
    const { keywords, location, type, classification, salary } = search;

    const urlSubfolder =
        `${textForUrl({ text: keywords.join(' ') })}-jobs` +
        (classification
            ? `-in-${textForUrl({ text: classification.category, lowerCase: true })}` +
              (classification.subcategory
                  ? `/${textForUrl({ text: classification.subcategory, lowerCase: true })}`
                  : '')
            : '') +
        `/in-${textForUrl({ text: location })}/` +
        textForUrl({ text: type, lowerCase: true });

    await expect(page).toHaveURL(new RegExp(urlSubfolder));

    if (salary) {
        const urlParams =
            'salaryrange=' +
            `${salary.from ? moneyForUrl({ value: salary.from }) : ''}` +
            `-${salary.to ? moneyForUrl({ value: salary.to }) : ''}` +
            `&salarytype=${salaryPeriodForUrl(salary.period)}`;

        await expect(page).toHaveURL(new RegExp(urlParams));
    }
}
