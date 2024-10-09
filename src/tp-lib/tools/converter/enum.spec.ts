/* tslint:disable no-magic-numbers */

import castEnum from './enum'
describe(`Tfw.Converter.Enum<T>`, () => {
    it(`should return default value 42`, () => {
        expect(castEnum<number>(27, [1, 2, 3], 42)).toBe(42)
    })
    it(`should return correct type`, () => {
        expect(castEnum<number>("2", [1, 2, 3], 42)).toBe(2)
    })
    it(`should match strings`, () => {
        expect(castEnum<string>("gama", ["alpha", "beta", "gama"], "delta")).toBe("gama")
    })
})
