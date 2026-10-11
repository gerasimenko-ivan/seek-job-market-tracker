import { appendFileSync, existsSync } from 'node:fs';

export interface AppendCsvRow {
    filePath: string;
    headers: string[];
    values: (string | number | undefined)[];
}

export function appendCsvRow(
    param: AppendCsvRow,
): void {
    const csvValuesRow = param.values.join(',');

    if (!existsSync(param.filePath)) {
        const csvHeadersRow = param.headers.join(',');

        appendFileSync(param.filePath, `${csvHeadersRow}\n`);
    }

    appendFileSync(param.filePath, `${csvValuesRow}\n`);
}
