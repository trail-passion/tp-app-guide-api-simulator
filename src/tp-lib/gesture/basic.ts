import GenericEvent from "../tools/generic-event"

export interface BasicGestureFingerEvent {
    pointerId: number
    initialX: number
    initialY: number
    initialTimestamp: number
    currentX: number
    currentY: number
    currentTimestamp: number
    event: PointerEvent
}

/**
 * Track pointer down, up and move, for one, two and three fingers.
 */
export default class BasicGesture {
    private fingers: BasicGestureFingerEvent[] = []
    public static readonly MAX_FINGERS = 3
    public readonly eventDown = new GenericEvent<BasicGestureFingerEvent[]>(
        "BasicGesture/down"
    )
    public readonly eventMove = new GenericEvent<BasicGestureFingerEvent[]>(
        "BasicGesture/move"
    )
    public readonly eventUp = new GenericEvent<BasicGestureFingerEvent[]>(
        "BasicGesture/up"
    )
    public readonly eventCancel = new GenericEvent<BasicGestureFingerEvent[]>(
        "BasicGesture/cancel"
    )

    constructor(private readonly element: HTMLElement | SVGElement) {
        element.addEventListener(
            "pointerdown",
            this.handleDown as EventListenerOrEventListenerObject,
            false
        )
        element.addEventListener(
            "pointermove",
            this.handleMove as EventListenerOrEventListenerObject,
            false
        )
        element.addEventListener(
            "pointerup",
            this.handleUp as EventListenerOrEventListenerObject,
            false
        )
        element.addEventListener(
            "pointercancel",
            this.handleCancel as EventListenerOrEventListenerObject,
            false
        )
    }

    /**
     * Detach all event listeners.
     */
    public detach() {
        const { element } = this
        element.addEventListener(
            "pointerdown",
            this.handleDown as EventListenerOrEventListenerObject,
            false
        )
        element.addEventListener(
            "pointermove",
            this.handleMove as EventListenerOrEventListenerObject,
            false
        )
        element.addEventListener(
            "pointerup",
            this.handleUp as EventListenerOrEventListenerObject,
            false
        )
        element.addEventListener(
            "pointercancel",
            this.handleCancel as EventListenerOrEventListenerObject,
            false
        )
    }

    private readonly handleDown = (evt: PointerEvent) => {
        const finger = this.getFingerOrCreateOne(evt)
        if (!finger) return

        const { element } = this
        element.setPointerCapture(evt.pointerId)
        finger.initialTimestamp = finger.currentTimestamp = evt.timeStamp
        finger.initialX = finger.currentX = evt.clientX
        finger.initialY = finger.currentY = evt.clientY
        this.eventDown.fire(this.cloneFingers())
    }

    private readonly handleMove = (evt: PointerEvent) => {
        const finger = this.getFinger(evt.pointerId)
        if (!finger) return

        finger.event = evt
        finger.currentTimestamp = evt.timeStamp
        finger.currentX = evt.clientX
        finger.currentY = evt.clientY
        this.eventMove.fire(this.cloneFingers())
    }

    private readonly handleUp = (evt: PointerEvent) => {
        const finger = this.getFinger(evt.pointerId)
        if (!finger) return

        finger.event = evt
        finger.currentTimestamp = evt.timeStamp
        finger.currentX = evt.clientX
        finger.currentY = evt.clientY
        this.eventUp.fire(this.cloneFingers())
        this.removeFinger(evt.pointerId)
    }

    private readonly handleCancel = (evt: PointerEvent) => {
        const finger = this.getFinger(evt.pointerId)
        if (!finger) return

        finger.event = evt
        finger.currentTimestamp = evt.timeStamp
        this.eventCancel.fire(this.cloneFingers())
        this.removeFinger(evt.pointerId)
    }

    private removeFinger(pointerId: number) {
        const { element } = this
        element.releasePointerCapture(pointerId)
        this.fingers = this.fingers.filter(
            finger => finger.pointerId !== pointerId
        )
    }

    private getFinger(pointerId: number): BasicGestureFingerEvent | undefined {
        const finger = this.fingers.find(f => f.pointerId === pointerId)
        return finger
    }

    private getFingerOrCreateOne(
        event: PointerEvent
    ): BasicGestureFingerEvent | undefined {
        const finger = this.getFinger(event.pointerId)
        if (finger) return finger

        if (this.fingers.length >= BasicGesture.MAX_FINGERS) return

        const newFinger: BasicGestureFingerEvent = {
            pointerId: event.pointerId,
            initialTimestamp: 0,
            initialX: 0,
            initialY: 0,
            currentTimestamp: 0,
            currentX: 0,
            currentY: 0,
            event,
        }
        this.fingers.push(newFinger)
        return newFinger
    }

    private cloneFingers(): BasicGestureFingerEvent[] {
        return [...this.fingers]
    }
}
