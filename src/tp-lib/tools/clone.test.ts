import { clone } from "./clone"

describe("tools/clone.ts", () => {
    const cases: unknown[] = [
        6,
        "Hello",
        [4, "world"],
        {
            age: 72,
            name: "bob",
            values: [4, "Hello"],
        },
        [
            {
                age: 72,
                name: "bob",
                values: [4, "Hello"],
                eat(a: number, b: number) {
                    return a + b
                },
            },
        ],
        { date: new Date() },
    ]
    for (const exp of cases) {
        it(`should clone ${JSON.stringify(exp)}`, () => {
            const got = clone(exp)
            expect(got).toEqual(exp)
        })
    }
    it("should be copy without link", () => {
        const input = [{ x: 6 }]
        const copy = clone(input)
        expect(copy[0] === input[0]).toBeFalsy()
    })
})
