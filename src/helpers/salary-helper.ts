import {
    SALARY_ANNUALLY,
    SALARY_HOURLY,
    SALARY_PERIOD,
    SalaryParams,
} from '../types/seek-search';
import { moneyForKey } from './string-helper';

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

export function salaryKey(salary: SalaryParams): string {
    if (!salary.from) {
        throw new Error('Salary "from" is required');
    }

    if (salary.to) {
        throw new Error('No implementation for: salary "to" specified');
    }

    return `${moneyForKey({
        value: salary.from,
        period: salary.period,
    })}_plus`;
}
