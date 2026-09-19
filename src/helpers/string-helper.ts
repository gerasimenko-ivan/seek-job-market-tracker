export interface ForUrlParams {
    text: string;
    lowerCase?: boolean;
}

export function forUrl(param: ForUrlParams): string {
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