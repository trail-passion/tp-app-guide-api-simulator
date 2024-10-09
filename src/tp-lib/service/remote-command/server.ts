import { isObject, isString } from "../../tools/type-guards"
import RemoteCommandServerInterface from "./types"

export default class RemoteCommandServer extends RemoteCommandServerInterface {
    private readonly methods = new Map<
        string,
        (params?: unknown) => Promise<unknown>
    >()

    constructor(private readonly prefix: string) {
        super()
        window.addEventListener("message", this.handleMessage, false)
    }

    fireEvent(name: string, data?: unknown): void {
        this.send({
            type: `${this.prefix}-Event`,
            name,
            data,
        })
    }

    registerMethod(
        name: string,
        method: (params?: unknown) => Promise<unknown>
    ): void {
        this.methods.set(name, method)
        console.log("Register:", name, method)
    }

    unregisterMethod(name: string): void {
        this.methods.delete(name)
    }

    private readonly handleMessage = (evt: MessageEvent) => {
        const payload: unknown = evt.data
        if (!isObject(payload)) return
        if (payload.type !== `${this.prefix}-Query`) return

        const { id, method, params } = payload
        if (!isString(id) || !isString(method)) return

        const callback = this.methods.get(method)
        if (!callback) {
            this.send({
                type: `${this.prefix}-Error`,
                id,
                code: 1000001,
                messsage: `Method "${method}" is unknown!`,
            })
        } else {
            const asyncFunction = async () => {
                try {
                    const data = await callback(params)
                    this.send({
                        type: `${this.prefix}-Response`,
                        id,
                        data,
                    })
                } catch (ex) {
                    this.send({
                        type: `${this.prefix}-Error`,
                        id,
                        code: 1000002,
                        messsage: JSON.stringify(ex),
                    })
                }
            }
            void asyncFunction()
        }
    }

    private send(data: Record<string, unknown>) {
        const { parent } = window
        if (!parent) return

        parent.postMessage(data, "*")
    }
}

// const query = ((child: HTMLIFrameElement) => {
//     return (method: string, params?: any) =>
//         new Promise((resolve, reject) => {
//             const id = queryId.toString(16)
//             pendingQueries.set(id, { resolve, reject })
//             child.contentWindow?.postMessage(
//                 {
//                     type: "BCS-Query",
//                     id,
//                     method,
//                     params,
//                 },
//                 "*"
//             )
//         })
// })(document.getElementById("My-IFrame") as HTMLIFrameElement)
