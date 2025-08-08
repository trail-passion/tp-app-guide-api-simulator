import * as React from "react"
import GpsSimulator from "../gps-simulator"
import Preview from "@/view/preview"
import TourSelector from "@/view/tour-selector"
import { IFrameController } from "../preview/hooks"

import "./app-view.css"

export interface AppViewProps {
    className?: string
}

const FAKE_CONTROLLER: IFrameController = {
    back() {},
    refresh() {},
}

export default function AppView(props: AppViewProps) {
    const [controller, setController] =
        React.useState<IFrameController>(FAKE_CONTROLLER)
    return (
        <div className={getClassNames(props)}>
            <Preview onReady={setController} />
            <div>
                <TourSelector onRefresh={() => controller.refresh()} />
                <GpsSimulator />
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
