import { WORK_ARRANGEMENT } from '../types/seek-search';

const WORK_ARRANGEMENT_BY_TEXT: Record<string, WORK_ARRANGEMENT> = {
    '(Hybrid)': WORK_ARRANGEMENT.HYBRID,
    '(Remote)': WORK_ARRANGEMENT.REMOTE,
};

export function workArrangementFromText(
    workArrangementText: string | undefined,
): WORK_ARRANGEMENT | undefined {
    if (!workArrangementText) {
        return undefined;
    }

    const workArrangement = WORK_ARRANGEMENT_BY_TEXT[workArrangementText];

    if (!workArrangement) {
        throw new Error(`Unknown work arrangement: '${workArrangementText}'`);
    }

    return workArrangement;
}
