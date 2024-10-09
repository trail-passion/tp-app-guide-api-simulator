import { MapFilter } from "tp-lib/types"

export enum TraceDataActivityEnum {
    Trail = 0,
    Running = 1,
    Trekking = 2,
    Cycling = 3,
    MountainBike = 4,
    AlpineSkiing = 5,
    CrossCountrySkiing = 6,
    AllTerrainVehicle = 7,
    Canoe = 8,
    HorseRiding = 9,
    NordicWalk = 10,
    Audioguide = 11,
    Snowshoes = 12,
}

export enum TraceDataLevelEnum {
    Unknown = 0,
    VeryEasy = 1,
    Easy = 2,
    Hard = 3,
    VeryHard = 4,
    Technical = 5,
    VeryTechnical = 6,
}

/**
 * This is how the data is used in the code,
 * not how it is stored.
 */
export type TraceData = {
    /** Trace's ID */
    id?: number
} & TraceDataAttributes &
    TraceDataChildren &
    TraceDataMap &
    TraceDataMarkers &
    TraceDataPoints

/**
 * Section dealing with points like latitude, longitude, time, distance, ...
 */
export interface TraceDataPoints {
    /** Latitudes */
    lat: number[]
    /** Longitudes */
    lng: number[]
    /** Altitudes in meters */
    alt: number[]
    /** Distances in meters */
    dis: number[]
    /** Accuracies in meters */
    acc: number[]
    /** Hearth rate in beats per minute */
    hrt: number[]
    /** Times in second (starting at 0) */
    tim: number[]
}

export interface TraceDataChildren {
    /** Other traces an be displayed along this one */
    children?: SecondaryTraceData[]
    switches?: []
    loops?: number
}

export interface TraceDataMap {
    /** Preferred map layer ID */
    map?: string
    /** Layer filter */
    filter?: MapFilter
}

export interface TraceDataMarkers {
    /** Touristic information */
    tourism: {
        level?: TourismInfo
        duration?: TourismInfo
        distance?: TourismInfo
        altitude?: TourismInfo
        elevation?: TourismInfo
        equipment?: TourismInfo
        parking?: TourismInfo
        balisage?: TourismInfo
    }
    /** POIs and steps */
    markers: MarkerData[]
}

export interface TraceDataAttributes {
    /** Claimed D+ in meters */
    claimedAscent: number
    /** Claimed D- in meters */
    claimedDescent: number
    /** Claimed total duration in seconds */
    claimedDuration: number
    /** Claimed distance in kilometers */
    claimedDistanceKm: number

    /** Trace description */
    description?: MultilingualText
    /** Creation date */
    date?: Date
    /** Group's name */
    groupName?: string
    /**
     * Difficulty level:
     * - 0: Unknown
     * - 1: Very easy
     * - 2: Easy
     * - 3: Hard
     * - 4: Very hard
     * - 5: Technical
     * - 6: Very technical
     */
    level: TraceDataLevelEnum
    /** Link to an external website */
    link?: string
    /** URL to the trace image (800x400) */
    logo: string
    /** Trace name */
    name: MultilingualText
    /** Trace owner nickname */
    authorName?: string
    /** Can we find this trace in the search results? */
    private: boolean
    /** Do we display an elevation graph? */
    profil: boolean
    /** Is this trace protected against export? */
    protected: boolean
    /** Threshold (in meters) for elevation computation */
    elevationThreshold: number
    activity: TraceDataActivityEnum
    /** Id of the owner */
    authorId?: number
}

export interface MultilingualText {
    [lang: string]: string
}

/**
 * A trace embeded into another.
 */
export interface SecondaryTraceData {
    /** Id of this embeded trace */
    id: number
    /** Trace name */
    name: MultilingualText
    bounds: GeoBounds
    visible: boolean
    /** Display color of this embeded trace */
    color: string
    /** Estimation of the difficulty (like pseudo-kilometers) */
    score: number
}

export interface GeoBounds {
    /** North: latitude max */
    n: number
    /** East: longitude max */
    e: number
    /** West: longitude min */
    w: number
    /** South: latitude min */
    s: number
}

export interface TourismInfo {
    /** Label */
    lbl: MultilingualText
    /** Value */
    val: MultilingualText
}

export interface MarkerData {
    /** Unique ID only used for editing. */
    id: number
    /** Latitude */
    lat: number
    /** Longitude */
    lng: number
    /** If defined, the trace point where this marker is attached */
    index?: number
    /** Marker type/behavior */
    type: MarkerType
    /** Pause time in seconds */
    pause?: number
    /** Short text that is always shown on the map */
    label?: MultilingualText
    /** Marker title you see when you tap the marker */
    name?: MultilingualText
    /**
     * This string is used to group markers together during editing.
     * It is not displayed on the final trace.
     */
    group?: string
    /** Long description shown when the user tap the marker and accesses the details */
    description?: MultilingualText
    /** URL of a picture */
    picture?: string
    /** Detection radius in meters */
    radius: number
    /** Speech to utter when near the marker */
    audio?: MultilingualText
    /** Array of icons URLs */
    icons: string[]
    /** Elimination time (displayed in red on the map) */
    stop?: string
}

export enum MarkerType {
    invisible = 0,
    /** Displayed on the elevation graph */
    primary = 1,
    /** Not displayed on the elevation graph */
    secondary = 2,
    /** Used to time a race */
    checkpoint = 3,
    /** This marker is never displayed, but will utter a speech when nearby */
    audio = 4,
}
