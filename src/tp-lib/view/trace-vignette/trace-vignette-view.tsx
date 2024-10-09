import * as React from "react"
import Touchable from "../../ui/view/touchable"
import SearchService from "../../service/search"
import { ITraceSummary } from "../../types/types"
import "./trace-vignette-view.css"

export interface TraceVignetteViewProps {
    className?: string
    id: number
    onClick?(id: number): void
}

export default function (props: TraceVignetteViewProps) {
    const [trace, setTrace] = React.useState<ITraceSummary | null>(null)
    const [loading, setLoading] = React.useState(true)
    React.useEffect(() => loadTrace(props.id, setTrace, setLoading), [props.id])
    const onClick = () => {
        if (props.onClick) {
            props.onClick(props.id)
        }
    }
    return (
        <Touchable className={getClassNames(props, loading)} onClick={onClick}>
            <img
                src={`/tfw/preview.php?jpg=${props.id}`}
                onLoad={() => setLoading(false)}
            />
            {trace && <header>{trace.name}</header>}
            {trace && (
                <footer>
                    <div className="km">{renderDistance(trace.km)}</div>
                    <div className="asc">{trace.asc}</div>
                    <div className="dsc">{trace.dsc}</div>
                </footer>
            )}
        </Touchable>
    )
}

function renderDistance(km: number): JSX.Element {
    const [integral, decimal] = km.toFixed(1).split(".")
    return (
        <>
            <b>{integral}</b>.<small>{decimal}</small>
        </>
    )
}

function getClassNames(
    props: TraceVignetteViewProps,
    loading: boolean
): string {
    const classNames = [
        "custom",
        "view-TraceVignetteView",
        "theme-color-primary",
        "theme-shadow-button",
    ]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (loading) classNames.push("loading")

    return classNames.join(" ")
}

function loadTrace(
    id: number,
    setTrace: React.Dispatch<React.SetStateAction<ITraceSummary | null>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
): void {
    setLoading(true)
    const process = async () => {
        try {
            const trace = await SearchService.Trace.byId(id)
            setTrace(trace)
        } catch (ex) {
            console.error(`Unable to load trace #${id}:`, ex)
        }
    }
    process()
}
