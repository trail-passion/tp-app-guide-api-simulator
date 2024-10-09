import * as React from "react"
import { GenericEventInterface } from "./../../tools/generic-event"

interface Translator {
    $lang: string
    $loadDefaultLang(lang?: string): Promise<void>
    $onChange: GenericEventInterface<Translator>
}

export function useCurrentLanguage(
    translator: Translator,
    ...otherTranslators: Translator[]
): [
    currentLanguage: string,
    setCurrentLanguage: (lang: string) => void,
    loading: boolean
] {
    const translators = [translator, ...otherTranslators]
    const [loading, setLoading] = React.useState(false)
    const [currentLanguage, setCurrentLanguage] = React.useState(
        translator.$lang
    )
    React.useEffect(() => {
        const handle = () => setCurrentLanguage(translator.$lang)
        translator.$onChange.add(handle)
        return () => translator.$onChange.remove(handle)
    }, [])
    React.useEffect(() => {
        const action = async () => {
            setLoading(true)
            for (const tr of translators) {
                await tr.$loadDefaultLang(currentLanguage)
            }
            setLoading(false)
        }
        void action()
    }, [currentLanguage])
    return [
        currentLanguage,
        lang => {
            setCurrentLanguage(lang)
            for (const tr of translators) {
                tr.$lang = lang
            }
        },
        loading,
    ]
}
