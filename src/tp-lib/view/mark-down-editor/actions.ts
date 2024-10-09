import FormatBoldIcon from "../../ui/view/icons/format-bold"
import FormatBulletsIcon from "../../ui/view/icons/format-bullets"
import FormatItalicIcon from "../../ui/view/icons/format-italic"
import LinkIcon from "../../ui/view/icons/link"
import PlusOIcon from "../../ui/view/icons/plus-o"
import QuoteIcon from "../../ui/view/icons/quote"
import { Icon } from "../../ui/view/icons/generic"
import { ReplaceArgument } from "./hooks"

export const ACTIONS: Array<
    [key: string, icon: Icon, replaceFunction: ReplaceArgument]
> = [
    ["b", FormatBoldIcon, ["**"]],
    ["i", FormatItalicIcon, ["_"]],
    [
        "-",
        FormatBulletsIcon,
        async (selection: string) => ({
            newText: `\n${selection
                .trim()
                .split("\n")
                .map(line => {
                    if (line.trim().length === 0) return ""
                    line = line.trimStart()
                    if (line.startsWith("- ") || line.startsWith("* "))
                        return line.substring(2)
                    return `- ${line}`
                })
                .join("\n")}\n\n`,
        }),
    ],
    [
        "k",
        LinkIcon,
        async (selection: string) => ({
            newText: `[${selection}](https://en.wikipedia.org)`,
            selStart: selection.length + 3,
            selLength: 24,
        }),
    ],
    [
        "'",
        QuoteIcon,
        async (selection: string) => ({
            newText: `\n${selection
                .trim()
                .split("\n")
                .map(line => {
                    if (line.trim().length === 0) return ""
                    line = line.trimStart()
                    if (line.startsWith("> ")) return line.substring(2)
                    return `> ${line}`
                })
                .join("\n")}\n\n`,
        }),
    ],
    [
        "e",
        PlusOIcon,
        async (selection: string) => ({
            newText: `<Expand label="More...">${selection.trim()}</Expand>`,
            selStart: 15,
            selLength: 7,
        }),
    ],
]
