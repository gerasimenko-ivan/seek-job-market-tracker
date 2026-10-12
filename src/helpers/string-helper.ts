export interface TextForUrlParams {
    text: string;
    lowerCase?: boolean;
}

export function textForUrl(param: TextForUrlParams): string {
    let url = param.text
        .replaceAll(',', '')
        .replaceAll('&', '')
        .replaceAll('/', ' ')
        .replace(/ +(?= )/g, '') // remove double spaces
        .replaceAll(' ', '-');

    if (param.lowerCase) {
        url = url.toLowerCase();
    }

    return url;
}

export function parseJobsCount(totalJobsMessage: string | null): number {
    if (totalJobsMessage === null) {
        throw new Error('Total jobs message was not found');
    }

    return parseInt(totalJobsMessage.replaceAll(',', ''), 10);
}