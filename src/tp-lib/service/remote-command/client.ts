import { isString } from "../../tools/type-guards"

interface PendingQuery {
    resolve(value: any): void
    reject(err: { code: number; message: string }): void
}

export interface RemoteControlEvent {
    name: string
    params?: any
}

export type RemoteControlListener = (event: RemoteControlEvent) => void

export default class RemoteControlClient {
    private queriesCounter = 1
    private readonly pendingQueries = new Map<string, PendingQuery>()
    private readonly listeners: RemoteControlListener[] = []
    private _iframe: HTMLIFrameElement | undefined

    constructor(private readonly prefix: string) {
        window.addEventListener(
            "message",
            evt => {
                const payload = evt.data
                if (!payload || typeof payload !== "object") return

                if (payload.type === `${prefix}-Event`) {
                    this.fireEvent(payload.name ?? "unknonw", payload.data)
                    return
                }

                const pendingQuery = this.pendingQueries.get(payload.id)
                if (!pendingQuery) return

                this.pendingQueries.delete(payload.id)
                const { resolve, reject } = pendingQuery
                switch (payload.type) {
                    case `${prefix}-Response`:
                        return resolve(payload.data)
                    case `${prefix}-Error`:
                        return reject({
                            code: payload.code,
                            message: payload.message,
                        })
                }
            },
            false
        )
    }

    get iframe() {
        return this._iframe
    }
    set iframe(value: HTMLIFrameElement | undefined) {
        this._iframe = value
    }

    addEventListener(listener: RemoteControlListener) {
        this.listeners.push(listener)
    }

    removeEventListener(listener: RemoteControlListener) {
        const { listeners } = this
        for (let index = listeners.length - 1; index >= 0; index--) {
            if (listener === listeners[index]) {
                listeners.splice(index, 1)
                return
            }
        }
    }

    async exec(method: string, params?: any): Promise<unknown> {
        const { iframe } = this
        if (!iframe) return undefined

        return new Promise((resolve, reject) => {
            const id = this.queriesCounter.toString(36)
            this.queriesCounter++
            this.pendingQueries.set(id, { resolve, reject })
            iframe.contentWindow?.postMessage(
                {
                    id,
                    type: `${this.prefix}-Query`,
                    method,
                    params,
                },
                "*"
            )
        })
    }

    private fireEvent(name: string, params: unknown) {
        for (const listener of this.listeners) {
            try {
                listener({ name, params })
            } catch (ex) {
                console.error("Error in a RemoteControlClient listener:", ex)
                console.log("...listener:", listener)
            }
        }
    }
}
