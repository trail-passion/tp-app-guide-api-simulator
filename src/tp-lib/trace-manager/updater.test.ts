import Updater from "./updater"
import { clone } from "../tools/clone"
import { DEFAULT_TRACE_DATA } from "./constants"
import { TraceData } from "tp-lib/types"

describe("trace-manager/updater.ts", () => {
    describe("Updater.canUndo()", () => {
        it("should be false if nothing has changed", () => {
            const updater = make()
            expect(updater.canUndo).toBeFalsy()
        })
        it("should be true after one update", () => {
            const updater = make()
            updater.update({
                authorName: "bob le testeur",
            })
            expect(updater.canUndo).toBeTruthy()
        })
        it("should be false after one update and one undo", () => {
            const updater = make()
            updater.update({
                authorName: "bob le testeur",
            })
            updater.undo()
            expect(updater.canUndo).toBeFalsy()
        })
    })
    describe("Updater.canRedo()", () => {
        it("should be false if nothing has changed", () => {
            const updater = make()
            expect(updater.canRedo).toBeFalsy()
        })
        it("should be false after one update", () => {
            const updater = make()
            updater.update({
                authorName: "canRedo?",
            })
            expect(updater.canRedo).toBeFalsy()
        })
        it("should be true after one update and one undo", () => {
            const updater = make()
            updater.update({
                authorName: "bob le testeur",
            })
            updater.undo()
            expect(updater.canRedo).toBeTruthy()
        })
    })
    describe(`Updater.undo()`, () => {
        const cases: Array<[init: string, ...steps: string[]]> = [
            ["Bob", "John"],
            ["Bob", "John", "Alfred", "Bernard", "Joe"],
        ]
        for (const [init, ...steps] of cases) {
            it(`should rollback to "${init}" after ${steps.length} steps`, () => {
                const updater = make({ authorName: init })
                for (const step of steps) {
                    updater.update({ authorName: step })
                }
                for (let i = steps.length - 2; i > -1; i--) {
                    updater.undo()
                    expect(updater.value.authorName).toEqual(steps[i])
                }
                updater.undo()
                expect(updater.value.authorName).toEqual(init)
            })
        }
    })
    describe(`Updater.redo()`, () => {
        const cases: Array<Partial<TraceData>[]> = [
            [{ authorName: "Mandrake" }],
        ]
        for (const steps of cases) {
            it(`should redo ${steps.length} steps`, () => {
                const updater = make()
                for (const step of steps) {
                    updater.update(step)
                }
                const end = clone(updater.value)
                for (let i = 0; i < steps.length; i++) {
                    updater.undo()
                }
                for (let i = 0; i < steps.length; i++) {
                    updater.redo()
                }
                expect(updater.value).toEqual(end)
            })
        }
    })
})

function make(update: Partial<TraceData> = {}): Updater {
    return new Updater({
        ...DEFAULT_TRACE_DATA,
        ...update,
    })
}
