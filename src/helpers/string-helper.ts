import { SALARY_PERIOD } from '../types/seek-search';

export interface TextForUrlParams {
    text: string;
    lowerCase?: boolean;
}

export function textForUrl(param: TextForUrlParams): string {
    let url = param.text
        .replaceAll(',', '')
        .replaceAll('&', '')
        .replace(/ +(?= )/g, '') // remove double spaces
        .replaceAll(' ', '-');

    if (param.lowerCase) {
        url = url.toLowerCase();
    }

    return url;
}

export interface MoneyForUrlParams {
    value: string;
}

export function moneyForUrl(param: MoneyForUrlParams): string {
    return param.value.replaceAll('$', '').replaceAll('K', '000');
}

export interface MoneyAsKeyParams {
    value: string;
    period: SALARY_PERIOD;
}

export function moneyForKey(param: MoneyAsKeyParams): string {
    let prefix = '';

    switch (param.period) {
        case SALARY_PERIOD.ANNUALLY:
            prefix = 'annual_';
            break;
        case SALARY_PERIOD.HOURLY:
            prefix = 'hourly_';
            break;
        default:
            throw new Error(`Period "${param.period}" is not supported.`);
    }

    return `${prefix}${param.value.replaceAll('$', '')}`;
}

export function salaryPeriodForUrl(period: SALARY_PERIOD): string {
    switch (period) {
        case SALARY_PERIOD.ANNUALLY:
            return 'annual';

        case SALARY_PERIOD.HOURLY:
            return 'hourly';

        default:
            throw new Error(`Unknown period for ${period}`);
    }
}

export function parseJobsCount(totalJobsMessage: string | null): number {
    if (totalJobsMessage === null) {
        throw new Error('Total jobs message was not found');
    }

    return parseInt(totalJobsMessage.replaceAll(',', ''), 10);
}