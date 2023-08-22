import Phone from "../phone"
import React, { useEffect } from "react"
import { IFrameController, useIFrame } from "./hooks"
import Button from "tp-lib/ui/view/button"
import "./preview.css"

interface IPreviewProps {
    className?: string
    onReady(controller: IFrameController): void
}

export default function Preview(props: IPreviewProps) {
    const [refIFrame, control] = useIFrame()
    useEffect(() => {
        if (refIFrame.current) props.onReady(control)
    }, [refIFrame.current])
    return (
        <Phone
            className={`tour-page-tour-Preview ${props.className ?? ""}`}
            onBack={control.back}
            onRefresh={control.refresh}
        >
            <iframe
                ref={refIFrame}
                title="App Preview"
                src={"./guide/index.html"}
            ></iframe>
        </Phone>
    )
}
