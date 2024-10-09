import Service from "../service"
import { assertListTracesProtocol, ListTracesModeProtocol } from "./types"
import {
    ISearchCriteria,
    ISearchTraceResult,
    ITraceSummary,
} from "../../types/types"

export default { all, mine, byId, byIds }

async function byId(id: number): Promise<ITraceSummary | null> {
    const serviceInput = { id, modes: "all" }
    const serviceOutput = await Service.exec("tp4.ListTraces", serviceInput)
    assertListTracesProtocol(serviceOutput)
    const traces = makeTraceSummaryArray(serviceOutput.all)
    if (traces.length === 0) return null
    return traces[0]
}

async function byIds(ids: number[]): Promise<ITraceSummary[]> {
    const serviceInput = { id: ids, modes: "all", limit: ids.length }
    const serviceOutput = await Service.exec("tp4.ListTraces", serviceInput)
    assertListTracesProtocol(serviceOutput)
    return makeTraceSummaryArray(serviceOutput.all)
}

async function all(
    criteria: Partial<ISearchCriteria>
): Promise<ISearchTraceResult> {
    const serviceInput = { ...criteria, modes: "all" }
    const serviceOutput = await Service.exec("tp4.ListTraces", serviceInput)
    assertListTracesProtocol(serviceOutput)
    const output = serviceOutput.all
    const searchResult = {
        page: serviceOutput.page,
        limit: serviceOutput.limit,
        count: serviceOutput.count,
        traces: makeTraceSummaryArray(output),
    }
    return searchResult
}

async function mine(
    criteria: Partial<ISearchCriteria>
): Promise<ISearchTraceResult> {
    const serviceInput = { ...criteria, modes: "private" }
    const serviceOutput = await Service.exec("tp4.ListTraces", serviceInput)
    assertListTracesProtocol(serviceOutput)
    const output = serviceOutput.private
    const searchResult = {
        page: serviceOutput.page,
        limit: serviceOutput.limit,
        count: serviceOutput.count,
        traces: makeTraceSummaryArray(output),
    }
    return searchResult
}

function makeTraceSummaryArray(
    input?: ListTracesModeProtocol
): ITraceSummary[] {
    if (!input) return []

    return input.I.map((id: number, index: number) => ({
        id,
        name: input.N[index],
        grp: input.G[index],
        owner: input.P[index],
        asc: input.A[index],
        dsc: input.D[index],
        km: input.K[index],
        mob: input.M[index] === 1,
    }))
}
