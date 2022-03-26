import Phone from "../phone"
import React from "react"
import { useIFrame } from "./hooks"
import "./preview.css"


interface IPreviewProps {
    className?: string
}

export default function Preview(props: IPreviewProps) {
    const [refIFrame, control] = useIFrame()
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
