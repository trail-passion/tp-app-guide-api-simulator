import BasicGesture, { BasicGestureFingerEvent } from "./basic"
import ElemMap from "./elements-map"

const MIN_SWIPE_DISPLACEMENT = 32

export interface SwipeGestureEvent {
    pointerId: number
    /** Pixels per second. Can be negative. */
    speedX: number
    /** Pixels per second. Can be negative. */
    speedY: number
}

export type SwipeGestureHandler = (event: SwipeGestureEvent) => void

interface SwipeGestureManager {
    basicGesture: BasicGesture
    handleUp(fingers: BasicGestureFingerEvent[]): void
}

const globalMap = new ElemMap<SwipeGestureHandler, SwipeGestureManager>()

export function addSwipeGesture(
    element: HTMLElement | SVGElement,
    handler: SwipeGestureHandler
) {
    const basicGesture = new BasicGesture(element)
    const handleUp = (fingers: BasicGestureFingerEvent[]) => {
        for (const finger of fingers) {
            const deltaX = finger.currentX - finger.initialX
            const deltaY = finger.currentY - finger.initialY
            if (
                Math.abs(deltaX) < MIN_SWIPE_DISPLACEMENT &&
                Math.abs(deltaY) < MIN_SWIPE_DISPLACEMENT
            )
                continue

            const elapsedTime =
                finger.currentTimestamp - finger.initialTimestamp
            if (elapsedTime > 0) {
                handler({
                    pointerId: finger.pointerId,
                    speedX: (deltaX * 1000) / elapsedTime,
                    speedY: (deltaY * 1000) / elapsedTime,
                })
            }
        }
    }
    const gestureManager: SwipeGestureManager = { basicGesture, handleUp }
    globalMap.set(element, handler, gestureManager)
    basicGesture.eventUp.add(handleUp)
}

export function removeSwipeGesture(
    element: HTMLElement | SVGElement,
    handler: SwipeGestureHandler
) {
    const gestureManager = globalMap.get(element, handler)
    if (!gestureManager) return

    gestureManager.basicGesture.detach()
    gestureManager.basicGesture.eventUp.remove(gestureManager.handleUp)
    globalMap.delete(element, handler)
}
