import * as React from "react"
import Expand from "../../ui/view/expand"
import Label from "../../ui/view/label"
import Markdown from "markdown-to-jsx"
import Touchable from "../../ui/view/touchable"
import { ACTIONS } from "./actions"
import { Icon } from "../../ui/view/icons/generic/generic-icon"
import { ReplaceArgument, useTextArea } from "./hooks"
import { useDebouncedEffect } from "../../ui/hooks"
import "./mark-down-editor.css"
// https://www.npmjs.com/package/markdown-to-jsx

interface IMarkDownEditorProps {
    value: string
    label?: string
    delay?: number
    onChange?: (value: string) => void
}

const DEFAULT_DEBOUNCE_DELAY = 700

export default function MarkdownEditor(props: IMarkDownEditorProps) {
    const [refTextArea, replaceSelection] = useTextArea()
    const [value, setValue] = React.useState(props.value)
    const [preview, setPreview] = React.useState(props.value)
    React.useEffect(() => setValue(props.value), [props.value])
    useDebouncedEffect(
        () => {
            setPreview(value)
            if (props.onChange) props.onChange(value)
        },
        props.delay ?? DEFAULT_DEBOUNCE_DELAY,
        [value]
    )
    const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) =>
        setValue(evt.target.value)
    const actions = ACTIONS
    useActionsShortcuts(refTextArea, actions, setValue, replaceSelection)

    return (
        <div className="tp-view-MarkDownEditor">
            <Label value={props.label} />
            <div className="icons theme-color-primary-dark">
                {actions.map(([key, icon, replacer], index) => (
                    <Touchable
                        className="icon"
                        key={index}
                        title={`Ctrl+${key.toUpperCase()}`}
                        onClick={async () =>
                            setValue(await replaceSelection(replacer))
                        }
                    >
                        {icon({})}
                    </Touchable>
                ))}
            </div>
            <div className="body theme-shadow-button theme-color-section">
                <div className="textarea">
                    <textarea
                        className="theme-color-input"
                        ref={refTextArea}
                        value={value}
                        onChange={handleChange}
                    />
                </div>
                <div className="markdown theme-color-frame">
                    <Markdown
                        options={{
                            overrides: {
                                Expand: {
                                    component: Expand,
                                },
                            },
                        }}
                    >
                        {preview}
                    </Markdown>
                </div>
            </div>
        </div>
    )
}
function useActionsShortcuts(
    refTextArea: React.MutableRefObject<HTMLTextAreaElement | null>,
    actions: [key: string, icon: Icon, replaceFunction: ReplaceArgument][],
    setValue: React.Dispatch<React.SetStateAction<string>>,
    replaceSelection: (args: ReplaceArgument) => Promise<string>
) {
    React.useEffect(() => {
        const textArea = refTextArea.current
        if (!textArea) return

        const handleKeyDown = async (evt: KeyboardEvent) => {
            if (!evt.ctrlKey) return

            const key = evt.key.toLowerCase()
            for (const [key, _icon, replacer] of actions) {
                if (key.toLowerCase() === evt.key.toLowerCase()) {
                    setValue(await replaceSelection(replacer))
                    evt.preventDefault()
                    return
                }
            }
            console.error("Not a known action: ", key)
        }
        textArea.addEventListener("keydown", handleKeyDown, true)
        return () =>
            textArea.removeEventListener("keydown", handleKeyDown, true)
    }, [])
}
