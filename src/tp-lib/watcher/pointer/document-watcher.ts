import { PointerWatcherEvent } from "./types"

export interface ActiveElement {
    element: HTMLElement | SVGElement
    onDrag(evt: PointerWatcherEvent): void
    onUp(evt: PointerWatcherEvent): void
}

class DocumentWatcher {
    private activeElement?: ActiveElement

    constructor() {
        document.addEventListener("pointermove", this.handlePointerMove, true)
        document.addEventListener("pointerup", this.handlePointerUp, true)
    }

    /**
     * @returns `false` if there is already an active element.
     */
    setActiveElement(activeElement: ActiveElement): boolean {
        if (this.activeElement) return false

        this.activeElement = activeElement
        return true
    }

    private readonly handlePointerMove = (evt: PointerEvent) => {
        const { activeElement } = this
        if (!activeElement) return

        const { element, onDrag } = activeElement
        onDrag(makeEvent(element, evt))
    }

    private readonly handlePointerUp = (evt: PointerEvent) => {
        const { activeElement } = this
        if (!activeElement) return

        const { element, onUp } = activeElement
        onUp(makeEvent(element, evt))
        delete this.activeElement
    }
}

function makeEvent(
    element: HTMLElement | SVGElement,
    evt: PointerEvent
): PointerWatcherEvent {
    const { left, top } = element.getBoundingClientRect()
    return {
        x: evt.clientX - left,
        y: evt.clientY - top
    }
}

export default new DocumentWatcher()
