import * as React from "react"
import Markdown from "markdown-to-jsx"

import { TranslateLib as Translate } from "tp-lib/translate"
import { IIntlText } from "tp-lib/types"

import "./rich-text-view.css"

export interface RichTextViewProps {
    className?: string
    lang?: string
    content: IIntlText | string
}

export default function RichTextView(props: RichTextViewProps) {
    return (
        <div className={getClassNames(props)}>
            <Markdown>{Translate.$toText(props.content, props.lang)}</Markdown>
        </div>
    )
}

function getClassNames(props: RichTextViewProps): string {
    const classNames = ["custom", "view-RichTextView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
