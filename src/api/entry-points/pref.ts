const STORAGE_PREFIX = "TrailPassionGuide/"

export async function ApiGetPref(key: string): Promise<string> {
    return window.localStorage.getItem(`${STORAGE_PREFIX}${key}`) ?? ""
}

export async function ApiSetPref(key: string, value: string): Promise<void> {
    window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, value)
}
