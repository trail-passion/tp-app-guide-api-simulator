import Service from '../service'

/**
 * Check if a user can edit a given trace.
 * @param traceId 
 * @param userId Optional. If not defined, it is the current user.
 */
export async function canEditTrace(traceId: number, userId?: number): Promise<boolean> {
    try {
        const result = await Service.exec(
            "tp.user.can",
            {
                action: 'edit-trace',
                trace: traceId,
                user: userId
            }
        )
        return result === true
    } catch (ex) {
        console.error(ex)
        console.error("    traceId:", traceId)
        console.error("    userId:", userId)
        return false
    }
}
