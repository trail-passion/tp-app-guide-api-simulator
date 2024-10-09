import Zip from './zip'

describe(`Module trace-tools/zip`, () => {
    describe(`zipLatitudes`, () => {
        const input = [3.125476, 3.124490, 3.123694]
        const expected = [3125476, -986, -796]
        it(`should zip ${input} into ${expected}`, () => {
            expect(Zip.zipLatitudes(input)).toEqual(expected)
        })
    })

    describe(`unzipLatitudes`, () => {
        const input = [3125476, -986, -796]
        const expected = [3.125476, 3.124490, 3.123694]
        it(`should unzip ${input} into ${expected}`, () => {
            const output = Zip.unzipLatitudes(input)
            expect(output[0]).toBeCloseTo(expected[0], 6)
            expect(output[1]).toBeCloseTo(expected[1], 6)
            expect(output[2]).toBeCloseTo(expected[2], 6)
        })
    })

})
