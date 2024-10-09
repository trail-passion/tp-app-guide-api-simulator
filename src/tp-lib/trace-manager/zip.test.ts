import { TraceFile } from "../types/trace-file"
import { zipTrace, unzipTrace, zipCoord } from "./zip"

describe("trace-manager/zip.ts", () => {
    describe("zipTrace() / unzipTrace()", () => {
        it("should be reversible", () => {
            const trace: TraceFile = {
                lat: [],
                lng: [4.51, 5, 5.12, 4.99, 4.87, 4.5],
                dis: [55, 57, 60, 69, 70, 85, 94, 125],
            }
            expect(unzipTrace(zipTrace(trace))).toEqual(trace)
        })
        it(`should zip`, () => {
            const trace: TraceFile = {
                lat: [],
                lng: [4.51, 5, 5.12, 4.99, 4.87, 4.5],
                dis: [55, 57, 60, 69, 70, 85, 94, 125],
                alt: [1650, 1653, 1640, 1640, 1666],
            }
            const expected: TraceFile = {
                lat: [],
                lng: [4510000, 490000, 120000, -130000, -120000, -370000],
                dis: [55, 2, 3, 9, 1, 15, 9, 31],
                alt: [1650, 3, -13, 0, 26],
            }
            const outcome = zipTrace(trace)
            expect({
                lat: outcome.lat,
                lng: outcome.lng,
                dis: outcome.dis,
                alt: outcome.alt,
            }).toEqual(expected)
        })
    })
    describe("zipCoord", () => {
        it(`should zip 6.15248`, () => {
            expect(zipCoord(6.15248)).toBe(6152480)
        })
    })
})
