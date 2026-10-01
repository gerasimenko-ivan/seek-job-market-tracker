import { LOCATION_TYPE } from '../types/seek-search';

export function locationTypeFromText(
    location: string,
): LOCATION_TYPE | undefined {
    if (!location) {
        return undefined;
    }

    for (const locationType of Object.values(LOCATION_TYPE)) {
        if (location.includes(locationType)) {
            return locationType;
        }
    }

    throw new Error(`Unknown location type '${location}'`);
}