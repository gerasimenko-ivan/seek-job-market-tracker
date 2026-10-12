export const jobMarketSalaryColumns = [
    'hourly_35_plus',
    'hourly_40_plus',
    'hourly_50_plus',
    'hourly_60_plus',
    'hourly_75_plus',
    'hourly_100_plus',
    'annual_80K_plus',
    'annual_100K_plus',
    'annual_120K_plus',
    'annual_150K_plus'
] as const;

export type JobMarketSalaryColumn = (typeof jobMarketSalaryColumns)[number];

export const jobMarketCsvHeaders = [
    'date',
    'keywords',
    'location',
    'type',
    'classification',
    ...jobMarketSalaryColumns
];