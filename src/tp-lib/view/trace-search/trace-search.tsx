import * as React from "react"
import castArray from "../../tools/converter/array"
import Checkbox from "../../ui/view/checkbox"
import Debouncer from "../../tools/async/debouncer"
import Input from "../../ui/view/input/text"
import Runnable from "../../ui/view/runnable"
import Search from "../../tools/search"
import SearchService from "../../service/search"
import TabStrip from "../../ui/view/tabstrip"
import TraceButton from "../trace-button/trace-button"
import { TranslateLib as Translate } from "tp-lib/translate"
import { ISearchCriteria, ITraceSummary } from "../../types/types"
import { useDebouncedEffect } from "../../ui/hooks"
import "./trace-search.css"

interface ITraceSearchProps {
    maxNumberOfTracesToDisplay: number
    onClick(trace: ITraceSummary): void
    onFound?(displayed: number, total: number): void
}

interface ITraceSearchState {
    page: number
    id: string
    name: string
    group: string
    traces: ITraceSummary[]
    onlyMine: boolean
}

const DEBOUNCER_DELAY = 300 // millisecs.
const TAB_SEARCH_BY_ID = 0
const TAB_SEARCH_BY_NAME = 1

export default function TraceSearch(props: ITraceSearchProps) {
    const [busy, setBusy] = React.useState(false)
    const [searchOnlyMytraces, setSearchOnlyMytraces] = React.useState(true)
    const [filterId, setFilterId] = React.useState("")
    const [filterName, setFilterName] = React.useState("")
    const [filterGroup, setFilterGroup] = React.useState("")
    const [matchingTraces, setMatchingTraces] = React.useState<ITraceSummary[]>(
        []
    )
    const handleTraceClick = (traceId: number) => {
        const traceSummary = matchingTraces.find((t) => t.id === traceId)
        if (!traceSummary) return

        props.onClick(traceSummary)
    }
    useDebouncedEffect(
        () => {
            const action = async () => {
                try {
                    setBusy(true)

                    const ids = filterId
                        .split(/[^0-9]+/)
                        .map((item) => parseInt(item, 10))
                        .filter((item) => !isNaN(item))
                        .filter((item) => item > 0)
                    if (ids.length > 0) {
                        const traces = await SearchService.Trace.byIds(ids)
                        setMatchingTraces(traces)
                        if (props.onFound)
                            props.onFound(traces.length, traces.length)
                        return
                    }

                    const nameCrit = Search.split(filterName)
                    const groupCrit = Search.split(filterGroup)
                    const result = searchOnlyMytraces
                        ? await SearchService.Trace.mine({
                              limit: props.maxNumberOfTracesToDisplay,
                              name: nameCrit,
                              group: groupCrit,
                          })
                        : await SearchService.Trace.all({
                              limit: props.maxNumberOfTracesToDisplay,
                              name: nameCrit,
                              group: groupCrit,
                          })
                    setMatchingTraces(result.traces.sort(sortByTraceSummary))
                    if (props.onFound)
                        props.onFound(result.traces.length, result.count)
                } catch (ex) {
                    console.error(ex)
                } finally {
                    setBusy(false)
                }
            }
            void action()
        },
        DEBOUNCER_DELAY,
        [searchOnlyMytraces, filterId, filterName, filterGroup]
    )
    return (
        <div className="tp-view-TraceSearch">
            <Checkbox
                label={Translate.onlyMyTraces}
                value={searchOnlyMytraces}
                onChange={setSearchOnlyMytraces}
                wide={true}
            />
            <div key="filter">
                <Input
                    label={Translate.traceId}
                    value={filterId}
                    onChange={setFilterId}
                />
                <Input
                    label={Translate.traceName}
                    value={filterName}
                    onChange={setFilterName}
                />
                <Input
                    label={Translate.traceGroup}
                    value={filterGroup}
                    onChange={setFilterGroup}
                />
            </div>
            <Runnable running={busy}>
                <div className="traces">
                    {matchingTraces.map((trace: ITraceSummary) => (
                        <TraceButton
                            key={trace.id}
                            id={trace.id}
                            name={trace.name}
                            grp={trace.grp}
                            asc={trace.asc}
                            dsc={trace.dsc}
                            km={trace.km}
                            onClick={handleTraceClick}
                        />
                    ))}
                </div>
            </Runnable>
        </div>
    )
}

function sortByTraceSummary(a: ITraceSummary, b: ITraceSummary) {
    const aName = `${a.name}\n${a.grp}`.trim().toLowerCase()
    const bName = `${b.name}\n${b.grp}`.trim().toLowerCase()
    // tslint:disable-next-line: strict-comparisons
    if (aName < bName) return -1
    // tslint:disable-next-line: strict-comparisons
    if (aName > bName) return +1
    return 0
}
