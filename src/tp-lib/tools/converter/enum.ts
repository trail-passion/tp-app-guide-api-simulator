export default function castEnum<T>(value: any, choices: T[], defaultValue: T): T {
    for (const possibleValue of choices) {
        /* tslint:disable triple-equals */
        // We want a lazy equal check because we are dealing with type conversion.
        if (value == possibleValue) {
            return possibleValue
        }
        /* eslint:enable triple-equals */
    }
    return defaultValue
}
