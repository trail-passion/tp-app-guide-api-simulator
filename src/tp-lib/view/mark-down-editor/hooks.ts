import * as React from "react"
import { isString } from "../../tools/type-guards"

export type ReplaceFunction = (selection: string) => Promise<{
    newText: string
    selStart?: number
    selLength?: number
}>

export type ReplaceArgument =
    | string
    | [string]
    | [string, string]
    | ReplaceFunction

export function useTextArea(): [
    React.MutableRefObject<HTMLTextAreaElement | null>,
    (args: ReplaceArgument) => Promise<string>
] {
    const ref = React.useRef<null | HTMLTextAreaElement>(null)
    return [
        ref,
        async (args: ReplaceArgument) => {
            const textArea = ref.current
            if (!textArea) return ""

            const replace: ReplaceFunction = makeReplaceFunction(args)
            const header = textArea.value.substring(0, textArea.selectionStart)
            const selection = textArea.value.substring(
                textArea.selectionStart,
                textArea.selectionEnd
            )
            const footer = textArea.value.substring(textArea.selectionEnd)
            const replacement = await replace(selection)
            textArea.value = `${header}${replacement.newText}${footer}`
            const start =
                header.length +
                (replacement.selStart ?? 0)
            const end = start + (replacement.selLength ?? replacement.newText.length)
            textArea.setSelectionRange(start, end)
            textArea.focus()
            return textArea.value
        },
    ]
}

function makeReplaceFunction(args: ReplaceArgument): ReplaceFunction {
    if (isString(args))
        return async () => {
            return {
                newText: args,
                selStart: 0,
                selLength: args.length,
            }
        }
    if (Array.isArray(args))
        return async (selection: string) => {
            const [a, b] = args
            const before = a ?? ""
            const after = b ?? before
            const newText = isSurroundedBy(selection, before, after)
                ? selection.substring(
                      before.length,
                      selection.length - after.length
                  )
                : `${before}${selection}${after}`
            return {
                newText,
                selStart: 0,
                selLength: newText.length,
            }
        }
    return args
}

function isSurroundedBy(selection: string, before: string, after: string) {
    if (selection.length < before.length + after.length) return false
    return selection.startsWith(before) && selection.endsWith(after)
}

