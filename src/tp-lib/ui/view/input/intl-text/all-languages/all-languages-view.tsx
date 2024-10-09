import * as React from "react"
import InputText from "../../text"
import Languages from "../../../combo-lang/languages.json"
import Options from "../../../options"
import { IIntlText } from "tp-lib/types"
import "./all-languages-view.css"

export interface AllLanguagesViewProps {
    className?: string
    value: IIntlText
    onChange(value: IIntlText): void
    lang: string
    onLangChange(lang: string): void
}

export default function AllLanguagesView(props: AllLanguagesViewProps) {
    const languages = Object.keys(props.value)
    const availableLanguages: string[] = getAvailableLanguages(
        props.value,
        props.lang
    )
    return (
        <div className={getClassNames(props)}>
            <Options
                className="flags"
                options={makeDict(availableLanguages)}
                value={props.lang}
                onChange={props.onLangChange}
            />
            {languages.map((lang) => (
                <InputText
                    key={lang}
                    wide={true}
                    label={`[${lang}] ${
                        (Languages as Record<string, string>)[lang] ?? ""
                    }`}
                    value={props.value[lang]}
                    onChange={(v) =>
                        props.onChange({
                            ...props.value,
                            [lang]: v,
                        })
                    }
                />
            ))}
        </div>
    )
}

function getClassNames(props: AllLanguagesViewProps): string {
    const classNames = ["custom", "ui-view-input-intlText-AllLanguagesView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function getAvailableLanguages(value: IIntlText, lang: string): string[] {
    const languages = Object.keys(value)
    if (languages.includes(lang)) return languages
    return [lang, ...languages]
}

function makeDict(availableLanguages: string[]): {
    [key: string]: string | JSX.Element
} {
    const dict: { [key: string]: string } = {}
    for (const key of availableLanguages) {
        dict[key] = key.toUpperCase()
    }
    return dict
}
