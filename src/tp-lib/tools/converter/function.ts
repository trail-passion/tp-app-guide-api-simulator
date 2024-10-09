const EMPTY_FUNCTION = () => {/* Empty function */}

type TFunction = () => void

export default function castBoolean(value: any, defaultValue: TFunction = EMPTY_FUNCTION): TFunction {
    if (typeof value === "function") return value

    return defaultValue
}
