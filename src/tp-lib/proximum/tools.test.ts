import { isSegmentInBounds, IProximumSegment } from './tools'

describe("tp/proximum/tools", () => {
    describe("isSegmentInBounds", () => {
        const filter = isSegmentInBounds({
            n: 20, s: 0, w: 0, e: 20
        })
        it("should find a segment with both ends inside the bounds", () => {
            const segment: IProximumSegment = {
                idx0: 0, len: 0, vecLat: 0, vecLng: 0,
                lat0: 5, lng0: 5, lat1: 15, lng1: 15
            }
            expect(filter(segment)).toBeTruthy()
        })
        it("should find a segment with one end inside and the other one far outside", () => {
            const segment: IProximumSegment = {
                idx0: 0, len: 0, vecLat: 0, vecLng: 0,
                lat0: 5, lng0: 5, lat1: 200, lng1: 50
            }
            expect(filter(segment)).toBeTruthy()
        })
        it("should NOT find a segment with both ends far outside the bounds", () => {
            const segment: IProximumSegment = {
                idx0: 0, len: 0, vecLat: 0, vecLng: 0,
                lat0: 50, lng0: 50, lat1: 45, lng1: 150
            }
            expect(filter(segment)).toBeFalsy()
        })
        it("should find a segment with both ends far outside the bounds but crossing the bounds", () => {
            const segment: IProximumSegment = {
                idx0: 0, len: 0, vecLat: 0, vecLng: 0,
                lat0: -50, lng0: 5, lat1: 150, lng1: 15
            }
            expect(filter(segment)).toBeTruthy()
        })
        it("should find a segment because of its thickness of 0.001", () => {
            const segment: IProximumSegment = {
                idx0: 0, len: 0, vecLat: 0, vecLng: 0,
                lat0: 20.001, lng0: 20.001, lat1: 150, lng1: 15
            }
            expect(filter(segment)).toBeTruthy()
        })
    })
})
