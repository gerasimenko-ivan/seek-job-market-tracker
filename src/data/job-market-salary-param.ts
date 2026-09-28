import { SALARY_ANNUALLY, SALARY_HOURLY, SalaryParams } from '../types/seek-search';
import { annually, hourly } from '../helpers/salary-helper';

export const salaryParams: SalaryParams[] = [
    hourly(SALARY_HOURLY.NZD_35),
    hourly(SALARY_HOURLY.NZD_50),
    hourly(SALARY_HOURLY.NZD_75),
    hourly(SALARY_HOURLY.NZD_100),
    annually(SALARY_ANNUALLY.NZD_80K),
    annually(SALARY_ANNUALLY.NZD_100K),
    annually(SALARY_ANNUALLY.NZD_120K),
    annually(SALARY_ANNUALLY.NZD_150K),
];
