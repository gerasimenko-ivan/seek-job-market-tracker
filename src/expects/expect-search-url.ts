import { expect } from '@playwright/test';
import { textForUrl } from '../helpers/string-helper.js';
import {
    salaryValueForUrl,
    salaryPeriodForUrl,
} from '../helpers/salary-helper.js';

import type { Page } from '@playwright/test';
import type { SearchParams } from '../types/seek-search.js';

interface ExpectSearchUrlParams {
    page: Page;
    search: SearchParams;
}

export async function expectSearchUrl(params: ExpectSearchUrlParams): Promise<void> {
    const { page, search } = params;
    const { keywords, location, type, classification, salary } = search;

    const classificationPath = classification
        ? `-in-${textForUrl({ text: classification.category, lowerCase: true })}` +
          (classification.subcategory
              ? `/${textForUrl({ text: classification.subcategory, lowerCase: true })}`
              : '')
        : '';
    const urlSubfolder =
        `${textForUrl({ text: keywords.join(' ') })}-jobs` +
        classificationPath +
        `/in-${textForUrl({ text: location })}/` +
        textForUrl({ text: type, lowerCase: true });

    await expect(page).toHaveURL(new RegExp(urlSubfolder));

    if (salary) {
        const salaryRange =
            `${salary.from ? salaryValueForUrl({ value: salary.from }) : ''}` +
            `-${salary.to ? salaryValueForUrl({ value: salary.to }) : ''}`;

        const urlParams =
            `salaryrange=${salaryRange}` +
            `&salarytype=${salaryPeriodForUrl(salary.period)}`;

        await expect(page).toHaveURL(new RegExp(urlParams));
    }
}
