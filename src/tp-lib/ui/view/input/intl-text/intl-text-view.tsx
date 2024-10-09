import * as React from "react"
import AllLanguages from "./all-languages"
import Dialog from "../../dialog"
import InputText from "../text"
import Modal from "../../../modal"
import { TextViewProps } from "../text/text-view"
import "./intl-text-view.css"

export interface IntlTextViewProps
    extends Omit<TextViewProps, "value" | "onChange"> {
    className?: string
    lang: string
    value: IIntlText
    onChange(value: IIntlText): void
    onLangClick(lang: string): void
}

export default function IntlTextView(props: IntlTextViewProps) {
    const value = $toText(props.value, props.lang)
    const inputProps: TextViewProps = {
        ...props,
        value,
        onChange: text =>
            props.onChange($addTranslation(props.lang, text, props.value)),
    }
    const handleDetail = async () => {
        let value = { ...props.value }
        const confirm = await Modal.confirm({
            title: props.label,
            padding: "0px",
            content: (
                <AllLanguages
                    value={value}
                    onChange={v => {
                        value = v
                    }}
                    lang={props.lang}
                    onLangChange={props.onLangClick}
                />
            ),
            labelOK: "OK",
        })
        if (confirm) props.onChange(value)
    }
    return (
        <div className={getClassNames(props)}>
            <InputText {...inputProps} />
            <div
                className="button theme-color-primary theme-shadow-button"
                tabIndex={0}
                onClick={handleDetail}
            >
                {props.lang}
            </div>
        </div>
    )
}

function getClassNames(props: IntlTextViewProps): string {
    const classNames = ["custom", "ui-view-input-IntlTextView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (props.wide === true) classNames.push("wide")

    return classNames.join(" ")
}

function $toText(intl: IIntlOrString, lang: string): string {
    if (!intl) return ""
    if (typeof intl === "string") return intl
    const text = intl[lang]
    if (typeof text === "string") return text
    const defaultText = intl[Object.keys(intl)[0]]
    if (typeof defaultText === "string") return defaultText

    return ""
}

/**
 * Add a `translation` for a given `language` to a given `dictionary`.
 * @param language Language of the translation.
 * @param translation Translation to add.
 * @param dictionary Current dictionary.
 * @returns A new dictionary with the new translation.
 */
function $addTranslation(
    language: string,
    translation: string,
    dictionary: IIntlOrString
): IIntlText {
    const intl = $toIntl(dictionary, language)
    intl[language] = translation
    const result: IIntlText = {}
    for (const key of Object.keys(intl)) {
        const val = intl[key]
        if (val.trim().length === 0) continue
        result[key] = val
    }

    return result
}

function $toIntl(text: IIntlOrString | undefined, lang: string): IIntlText {
    if (!text) return { [lang]: "" }
    if (Array.isArray(text)) {
        return {
            [lang]: text
                .filter(t => typeof t === "string")
                .map((item: string) => `${item}`)
                .join(""),
        }
    }
    if (typeof text === "object") {
        const obj: { [key: string]: string } = {}
        const keys = Object.keys(text)
            .filter(key => typeof key === "string")
            .filter(key => key.trim().length > 1)
        for (const key of keys) {
            obj[key] = text[key]
        }
        return obj
    }

    return { [lang]: text }
}

interface IIntlText {
    [key: string]: string
}

type IIntlOrString = IIntlText | string
