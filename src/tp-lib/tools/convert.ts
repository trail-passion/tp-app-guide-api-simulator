import { ITrace, ITraceSummary, TraceData } from "tp-lib/types"
import { TranslateLib as Translate } from "tp-lib/translate"
export default {
    traceIntoTraceSummary,
    traceSummaryIntoTrace,
    traceDataIntoTraceSummary,
}

function traceIntoTraceSummary(trace: ITrace): ITraceSummary {
    return {
        id: 0,
        name: "",
        grp: "",
        owner: "",
        asc: 0,
        dsc: 0,
        km: 0,
        mob: false,
        ...trace,
    }
}

function traceSummaryIntoTrace(traceSummary: ITraceSummary): ITrace {
    return {
        lat: [],
        lng: [],
        ...traceSummary,
    }
}

function traceDataIntoTraceSummary(trace: TraceData): ITraceSummary {
    return {
        id: trace.id ?? 0,
        name: Translate.$toText(trace.name),
        grp: Translate.$toText(trace.groupName),
        owner: trace.authorName ?? "",
        asc: trace.claimedAscent ?? 0,
        dsc: trace.claimedDescent ?? 0,
        km: trace.claimedDistanceKm ?? 0,
        mob: false,
    }
}
