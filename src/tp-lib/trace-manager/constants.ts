import { TraceData } from "../types/trace-data"
import {
    TraceDataActivityEnum,
    TraceDataAttributes,
    TraceDataChildren,
    TraceDataLevelEnum,
    TraceDataMap,
    TraceDataMarkers,
    TraceDataPoints,
} from "tp-lib/types"

export const DEFAULT_TRACE_DATA_ATTRIBUTES: Required<TraceDataAttributes> = {
    activity: TraceDataActivityEnum.Trail,
    authorId: 0,
    authorName: "",
    claimedAscent: 0,
    claimedDescent: 0,
    claimedDistanceKm: 0,
    claimedDuration: 0,
    date: new Date(),
    description: {},
    elevationThreshold: 15,
    groupName: "",
    level: TraceDataLevelEnum.Unknown,
    link: "",
    logo: "",
    name: {},
    private: false,
    profil: true,
    protected: false,
}

export const DEFAULT_TRACE_DATA_CHILDREN: Required<TraceDataChildren> = {
    children: [],
    loops: 0,
    switches: [],
}

export const DEFAULT_TRACE_DATA_MAP: Required<TraceDataMap> = {
    filter: "none",
    map: "osm",
}

export const DEFAULT_TRACE_DATA_MARKERS: Required<TraceDataMarkers> = {
    markers: [],
    tourism: {},
}

export const DEFAULT_TRACE_DATA_POINTS: Required<TraceDataPoints> = {
    acc: [],
    alt: [],
    dis: [],
    hrt: [],
    lat: [],
    lng: [],
    tim: [],
}

export const DEFAULT_TRACE_DATA: TraceData = {
    id: 0,
    ...DEFAULT_TRACE_DATA_ATTRIBUTES,
    ...DEFAULT_TRACE_DATA_CHILDREN,
    ...DEFAULT_TRACE_DATA_MAP,
    ...DEFAULT_TRACE_DATA_MARKERS,
    ...DEFAULT_TRACE_DATA_POINTS,
}
