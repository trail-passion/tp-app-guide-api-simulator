// https://www.npmjs.com/package/markdown-to-jsx
import * as React from "react"
import Expand from "../../ui/view/expand"
import Markdown from "markdown-to-jsx"

import "./mark-down-viewer.css"

interface IMarkDownEditorProps {
    className?: string
    value: string
}

export default function MarkdownEditor({
    className,
    value,
}: IMarkDownEditorProps) {
    return (
        <div className={`tp-view-MarkDownViewer ${className ?? ""}`}>
            <Markdown
                options={{
                    overrides: {
                        Expand: {
                            component: Expand,
                        },
                    },
                }}
            >
                {value}
            </Markdown>
        </div>
    )
}
