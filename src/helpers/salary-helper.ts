import type { SalaryParams } from '../types/seek-search.js';
import { SALARY_ANNUALLY, SALARY_HOURLY, SALARY_PERIOD } from '../types/seek-search.js';

export function hourly(from: SALARY_HOURLY): SalaryParams {
    return {
        period: SALARY_PERIOD.HOURLY,
        from,
    };
}

export function annually(from: SALARY_ANNUALLY): SalaryParams {
    return {
        period: SALARY_PERIOD.ANNUALLY,
        from,
    };
}

interface SalaryValueForUrl {
    value: string;
}

export function salaryValueForUrl(param: SalaryValueForUrl): string {
    return param.value.replaceAll('$', '').replaceAll('K', '000');
}

interface SalaryValueForKey {
    value: string;
    period: SALARY_PERIOD;
}

export function salaryValueForKey(param: SalaryValueForKey): string {
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

export function salaryKey(salary: SalaryParams): string {
    if (!salary.from) {
        throw new Error('Salary "from" is required');
    }

    if (salary.to) {
        throw new Error('No implementation for: salary "to" specified');
    }

    return `${salaryValueForKey({
        value: salary.from,
        period: salary.period,
    })}_plus`;
}
