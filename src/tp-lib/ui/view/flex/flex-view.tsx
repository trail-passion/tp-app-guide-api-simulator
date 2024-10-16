import * as React from "react"
import "./flex-view.css"

export interface FlexViewProps {
    className?: string
    children?: JSX.Element | JSX.Element[] | null
    dir?: "row" | "column" | "row-reverse" | "column-reverse"
    gap?: string
    justifyContent?:
        | "baseline"
        | "center"
        | "end"
        | "first baseline"
        | "flex-start"
        | "flex-end"
        | "last baseline"
        | "left"
        | "right"
        | "safe"
        | "start"
        | "space-around"
        | "space-between"
    alignItems?: "baseline" | "center" | "flex-start" | "flex-end" | "stretch"
    wrap?: "wrap" | "nowrap" | "wrap-reverse"
    padding?: string
    margin?: string
}

export default function FlexView(props: FlexViewProps) {
    const style: React.CSSProperties = {
        flexDirection: props.dir,
        justifyContent: props.justifyContent,
        alignItems: props.alignItems,
        flexWrap: props.wrap,
        gap: props.gap ?? "1em",
        padding: props.padding ?? "0",
        margin: props.margin ?? "0",
    }
    return (
        <div className={getClassNames(props)} style={style}>
            {props.children}
        </div>
    )
}

function getClassNames(props: FlexViewProps): string {
    const classNames = ["custom", "ui-view-FlexView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
