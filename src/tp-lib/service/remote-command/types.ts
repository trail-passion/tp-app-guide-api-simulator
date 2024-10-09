import { isNumber, isObject, isString } from "../../tools/type-guards"

export interface RemoteCommandError {
    code: number
    message: string
}

export default abstract class RemoteCommandServerInterface {
    /**
     * Send an event to the parent window (if any).
     */
    abstract fireEvent(name: string, data?: unknown): void

    /**
     * Register the implementation of an API method.
     * @param method Async method.
     * Can throw an exception of type `RemoteCommandError`.
     */
    abstract registerMethod(
        name: string,
        method: (params?: unknown) => Promise<unknown>
    ): void

    /**
     * Unregister a method implementation.
     */
    abstract unregisterMethod(name: string): void
}

export function isRemoteCommandError(
    data: unknown
): data is RemoteCommandError {
    if (!isObject(data)) return false
    const { code, message } = data
    return isNumber(code) && isString(message)
}

export function ensureRemoteCommandServerInterface(
    data: unknown
): RemoteCommandServerInterface {
    if (data instanceof RemoteCommandServerInterface) return data

    console.error("Expected RemoteCommandServerInterface but got:", data)
    throw Error("Service is not of type RemoteCommandServerInterface!")
}
