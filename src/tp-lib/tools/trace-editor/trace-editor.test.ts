import TraceEditor from './trace-editor'

describe("tp/tools/trace-editor", () => {
    describe("push", () => {
        const trace = {
            lat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            lng: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        }
        const editor = new TraceEditor(trace)

        it("should append to the end", () => {
            editor.exec({
                start: 10, deleteCount: 0,
                lat: [10], lng: [10]
            })
            expect(editor.trace.lat).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        })

        it("should undo previous action", () => {
            editor.undo()
            expect(editor.trace.lat).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
        })
    })

    describe("unshift", () => {
        const trace = {
            lat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            lng: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        }
        const editor = new TraceEditor(trace)

        it("should append to the head", () => {
            editor.exec({
                start: 0, deleteCount: 0,
                lat: [-2, -1], lng: [-2, -1]
            })
            expect(editor.trace.lat).toEqual([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
        })

        it("should undo previous action", () => {
            editor.undo()
            expect(editor.trace.lat).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
        })
    })

    describe("remove", () => {
        const trace = {
            lat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            lng: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        }
        const editor = new TraceEditor(trace)

        it("should remove at the end", () => {
            editor.exec({
                start: 6, deleteCount: 4,
                lat: [], lng: []
            })
            expect(editor.trace.lat).toEqual([0, 1, 2, 3, 4, 5])
        })

        it("should undo previous action", () => {
            editor.undo()
            expect(editor.trace.lat).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
        })
    })

})
