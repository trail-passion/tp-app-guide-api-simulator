import * as React from "react"
import Color from "../../color"
import { ThemeColorName } from "../types"
import "./touchable-view.css"

export interface TouchableViewProps<T> {
    className?: string
    title?: string
    style?: React.CSSProperties
    backgroundColor?: string
    children:
        | string
        | boolean
        | null
        | JSX.Element
        | Array<string | boolean | null | JSX.Element>
    enabled?: boolean
    tag?: T
    onClick(tag?: T): void
}

export default function TouchableView<T>(props: TouchableViewProps<T>) {
    const style: React.CSSProperties = { ...props.style }
    if (props.backgroundColor) {
        style.backgroundColor = props.backgroundColor
        style.color = Color.bestContrast(props.backgroundColor, "#000", "#fff")
    }
    return (
        <button
            className={getClassNames<T>(props)}
            onClick={() => props.onClick(props.tag)}
            title={props.title}
            style={style}
        >
            {props.children}
        </button>
    )
}

function getClassNames<T>(props: TouchableViewProps<T>): string {
    const classNames = ["custom", "ui-view-TouchableView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (props.enabled === false) classNames.push("disabled")

    return classNames.join(" ")
}
