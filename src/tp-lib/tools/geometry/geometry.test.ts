import Geom from "./geometry"
import { IBounds } from "tp-lib/types"

describe(`Geometry`, () => {
    describe(`ensureInRange()`, () => {
        function check(
            value: number,
            min: number,
            max: number,
            expected: number
        ) {
            it(`(${value}, ${min}, ${max}) should return ${expected}`, () => {
                expect(Geom.ensureInRange(value, min, max)).toBeCloseTo(
                    expected,
                    6
                )
            })
        }

        check(0, -10, +10, 0)
        check(0, 100, 300, 200)
        check(-2000, -180, +180, 160)
        check(2000, -180, +180, -160)
        check(200, -180, +180, -160)
        check(547, 666, 666, 666)
    })

    describe(`boundsIntersect()`, () => {
        function check(a: IBounds, b: IBounds, expected: boolean) {
            it(`${JSON.stringify(b)} should ${
                expected ? "" : "NOT "
            }intersect ${JSON.stringify(b)}`, () => {
                expect(Geom.boundsIntersect(a, b)).toBe(expected)
            })
        }

        check(
            { n: 56.1, s: 31.9, e: 17.8, w: -14.9 },
            { n: 90, s: 45, e: 180, w: 90 },
            false
        )
        check(
            { n: 56.1, s: 31.9, e: 17.8, w: -14.9 },
            { n: 90, s: 67.5, e: 45, w: 0 },
            false
        )
    })
})
