import { appendFileSync, existsSync } from 'node:fs';

export interface AppendCsvRow {
    filePath: string;
    headers: string[];
    values: (string | number | undefined)[];
}

export function appendCsvRow(
    param: AppendCsvRow,
): void {
    const csvRow = param.values.join(',');

    if (!existsSync(param.filePath)) {
        appendFileSync(param.filePath, `${param.headers.join(',')}\n`);
    }

    appendFileSync(param.filePath, `${csvRow}\n`);
}
