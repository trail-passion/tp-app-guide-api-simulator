import Service from "../service"

export interface Trust {
    traces: Array<{
        id: number
        name: string
        type: number
    }>
    followers: TrustUser[]
    following: TrustUser[]
}

export interface TrustUser {
    id: number
    name: string
    md5: string
}

export default {
    async inviteUser(email: string): Promise<void> {
        try {
            const errorCode = await Service.exec("tp4.Invite", { email })
            switch (errorCode) {
                case 0:
                    return
                case -1:
                    throw Error("Missing argument!")
                case -2:
                    throw Error("Unknonw nickname!")
                case -3:
                    throw Error("Unable to send the email!")
                default:
                    throw Error(`Unknonw error: #${errorCode}!`)
            }
        } catch (ex) {
            console.error(`Unable to invite user "${email}"!`, ex)
            throw ex
        }
    },

    async untrustUser(userId: number): Promise<void> {
        try {
            const errorCode = await Service.exec("tp4.Trust", {
                trustee: userId,
                kind: -2,
            })
            if (errorCode !== 0) throw Error(`Error code: ${errorCode}!`)
        } catch (ex) {
            console.error(`Unable to remove trust from user #${userId}!`, ex)
            throw ex
        }
    },

    async trustTrace(traceId: number): Promise<void> {
        try {
            const errorCode = await Service.exec("tp4.Trust", {
                trustee: traceId,
                kind: 1,
            })
            if (errorCode !== 0) throw Error(`Error code: ${errorCode}!`)
        } catch (ex) {
            console.error(`Unable to give trust to trace #${traceId}!`, ex)
            throw ex
        }
    },

    async untrustTrace(traceId: number): Promise<void> {
        try {
            const errorCode = await Service.exec("tp4.Trust", {
                trustee: traceId,
                kind: -1,
            })
            if (errorCode !== 0) throw Error(`Error code: ${errorCode}!`)
        } catch (ex) {
            console.error(`Unable to remove trust from trace #${traceId}!`, ex)
            throw ex
        }
    },

    /**
     * @returns All the permissions related to the GPS follow feature, for the current user.
     */
    async getFromCurrentUser(): Promise<Trust> {
        try {
            const trust = await Service.exec("tp4.ListTrust")
            if (!isListTrustResult(trust)) {
                console.error("Bad format:", trust)
                throw Error("Bad format")
            }
            return {
                traces: trust.traces.id.map((id, index) => ({
                    id,
                    name: trust.traces.name[index],
                    type: trust.traces.type[index],
                })),
                followers: trust.followers.id.map((id, index) => ({
                    id,
                    md5: trust.followers.md5[index],
                    name: trust.followers.name[index],
                })),
                following: trust.following.id.map((id, index) => ({
                    id,
                    md5: trust.following.md5[index],
                    name: trust.following.name[index],
                })),
            }
        } catch (ex) {
            console.error("Unable to get trust for current user!", ex)
            return {
                traces: [],
                followers: [],
                following: [],
            }
        }
    },
}

interface ListTrustTrace {
    id: number[]
    name: string[]
    type: number[]
}

interface ListTrustUser {
    id: number[]
    name: string[]
    md5: string[]
}

interface ListTrustResult {
    traces: ListTrustTrace
    followers: ListTrustUser
    following: ListTrustUser
}

function isListTrustResult(data: any): data is ListTrustResult {
    if (typeof data !== "object") return false
    const { traces, followers, following } = data
    if (!isListTrustTrace(traces)) return false
    if (!isListTrustUser(followers)) return false
    if (!isListTrustUser(following)) return false
    return true
}

function isListTrustTrace(data: any): data is ListTrustTrace {
    if (typeof data !== "object") return false
    const { id, name, type } = data
    if (!Array.isArray(id)) return false
    if (!Array.isArray(name)) return false
    if (!Array.isArray(type)) return false
    return true
}

function isListTrustUser(data: any): data is ListTrustUser {
    if (typeof data !== "object") return false
    const { id, name, md5 } = data
    if (!Array.isArray(id)) return false
    if (!Array.isArray(name)) return false
    if (!Array.isArray(md5)) return false
    return true
}
