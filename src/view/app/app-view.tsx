import * as React from "react"
import Preview from "@/view/preview"
import TourSelector from "@/view/tour-selector"
import "./app-view.css"

export interface AppViewProps {
    className?: string
}

export default function AppView(props: AppViewProps) {
    return (
        <div className={getClassNames(props)}>
            <Preview />
            <div>
                <TourSelector />
            </div>
        </div>
    )
}

function getClassNames(props: AppViewProps): string {
    const classNames = ["custom", "view-AppView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
