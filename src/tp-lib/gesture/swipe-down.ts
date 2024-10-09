import { SwipeGestureHandler, SwipeGestureEvent } from "./swipe"
import { addSwipeGesture, removeSwipeGesture } from "./swipe"
import ElemMap from "./elements-map"

export interface SwipeDownGestureEvent {
    /** pixels per second */
    speed: number
}

export type SwipeDownGestureHandler = (event: SwipeDownGestureEvent) => void

const globalMap = new ElemMap<SwipeDownGestureHandler, SwipeGestureHandler>()

export function addSwipeDownGesture(
    element: HTMLElement | SVGElement,
    handler: SwipeDownGestureHandler
) {
    const swipeHandler: SwipeGestureHandler = (event: SwipeGestureEvent) => {
        const {speedX, speedY}=event
        if (speedY<0) return
        if (Math.abs(speedY) < Math.abs(speedX)) return

        handler({speed: Math.abs(speedY)})
    }
    globalMap.set(element, handler, swipeHandler)
    addSwipeGesture(element, swipeHandler)
}

export function removeSwipeDownGesture(
    element: HTMLElement | SVGElement,
    handler: SwipeDownGestureHandler
) {
    const swipeHandler = globalMap.get(element, handler)
    if (!swipeHandler) return

    globalMap.delete(element, handler)
    removeSwipeGesture(element, swipeHandler)
}
