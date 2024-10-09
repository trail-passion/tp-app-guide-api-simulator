import * as React from "react"
import { ensureNumber } from "../../tools/type-guards"
import "./distance-view.css"

export interface DistanceViewProps {
    className?: string
    /** Distance expressed in km. */
    km: number
    digits?: number
    hideUnit?: boolean
}

export default function DistanceView(props: DistanceViewProps) {
    const [integral, decimal] = props.km
        .toFixed(ensureNumber(props.digits, 1))
        .split(".")
    return (
        <span className={getClassNames(props)}>
            {integral}
            <small>.{decimal}</small>
            {props.hideUnit !== true && <span> km</span>}
        </span>
    )
}

function getClassNames(props: DistanceViewProps): string {
    const classNames = ["custom", "view-DistanceView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
