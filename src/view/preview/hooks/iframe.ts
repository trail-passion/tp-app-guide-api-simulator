import * as React from "react"
import Api from "@/api"

type IMessageItem =
    | string
    | boolean
    | null
    | IMessageItem[]
    | { [key: string]: IMessageItem }

export interface IMessage {
    [key: string]: IMessageItem
}

export function useIFrame(): [
    refIFrame: React.MutableRefObject<null | HTMLIFrameElement>,
    control: { back: () => void; refresh: () => void }
] {
    const refIFrame = React.useRef<null | HTMLIFrameElement>(null)
    const post = makePost(refIFrame)
    React.useEffect(() => {
        const iframe = refIFrame.current
        if (!iframe) return

        const handleMessage = (evt: MessageEvent<string>) => Api(evt.data, post)
        window.addEventListener("message", handleMessage)
        return () => window.removeEventListener("message", handleMessage)
    }, [refIFrame.current])
    return [
        refIFrame,
        {
            back() {
                post({ id: "BACK" })
            },
            refresh() {
                post({ id: "RELOAD" })
            },
        },
    ]
}

function makePost(refIFrame: React.MutableRefObject<HTMLIFrameElement | null>) {
    return (message: IMessage) => {
        const iframe = refIFrame.current
        if (!iframe) return

        const win = iframe.contentWindow
        if (!win) return

        win.postMessage(JSON.stringify(message), "*")
    }
}
