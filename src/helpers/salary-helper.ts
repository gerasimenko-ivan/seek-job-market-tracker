import {
    SALARY_ANNUALLY,
    SALARY_HOURLY,
    SALARY_PERIOD,
    SalaryParams,
} from '../types/seek-search';

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
