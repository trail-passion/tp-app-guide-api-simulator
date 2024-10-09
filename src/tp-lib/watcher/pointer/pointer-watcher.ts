import { PointerWatcherEvent } from "./types"
import DocumentWatcher from "./document-watcher"

export default class PointerWatcher {
    private isTouching = false
    private readonly savedTouchAction: string
    constructor(
        private readonly element: HTMLElement | SVGElement,
        private readonly listeners: {
            onMove?: (evt: PointerWatcherEvent) => void
            onDrag?: (evt: PointerWatcherEvent) => void
            onDown?: (evt: PointerWatcherEvent) => void
            onUp?: (evt: PointerWatcherEvent) => void
            onDblClick?: (evt: PointerWatcherEvent) => void
        }
    ) {
        element.addEventListener("contextmenu", this.handleContextMenu, false)
        element.addEventListener(
            "pointerdown",
            this.handlePointerDown as EventListenerOrEventListenerObject,
            false
        )
        element.addEventListener(
            "pointermove",
            this.handlePointerMove as EventListenerOrEventListenerObject,
            false
        )
        element.addEventListener(
            "dblclick",
            this.handleDoubleClick as EventListenerOrEventListenerObject,
            false
        )
        this.savedTouchAction = element.style.touchAction
        element.style.touchAction = "none"
    }

    detach() {
        const { element, savedTouchAction } = this
        element.style.touchAction = savedTouchAction
        element.removeEventListener(
            "contextmenu",
            this.handleContextMenu,
            false
        )
        element.removeEventListener(
            "pointerdown",
            this.handlePointerDown as EventListenerOrEventListenerObject,
            false
        )
        element.removeEventListener(
            "pointermove",
            this.handlePointerMove as EventListenerOrEventListenerObject,
            false
        )
    }

    private readonly onDrag = (evt: PointerWatcherEvent) => {
        const { onDrag } = this.listeners
        if (onDrag) onDrag(evt)
    }

    private readonly onUp = (evt: PointerWatcherEvent) => {
        this.isTouching = false
        const { onUp } = this.listeners
        if (onUp) onUp(evt)
    }

    private readonly handleDoubleClick = (evt: MouseEvent) => {
        const { onDblClick } = this.listeners
        if (!onDblClick) return

        onDblClick(this.makeEvent(evt))
    }

    private readonly handleContextMenu = (evt: Event) => {
        evt.preventDefault()
    }

    private readonly handlePointerDown = (evt: PointerEvent) => {
        const { element, onDrag, onUp } = this
        if (
            DocumentWatcher.setActiveElement({
                element,
                onDrag,
                onUp,
            })
        ) {
            this.isTouching = true
            const { onDown } = this.listeners
            if (onDown) onDown(this.makeEvent(evt))
        }
    }

    private readonly handlePointerMove = (evt: PointerEvent) => {
        if (this.isTouching) return

        const { onMove } = this.listeners
        if (!onMove) return

        onMove(this.makeEvent(evt))
    }

    private makeEvent(evt: MouseEvent): PointerWatcherEvent {
        const rect = this.element.getBoundingClientRect()
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top,
        }
    }
}
