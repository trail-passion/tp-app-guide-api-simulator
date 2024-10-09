import {
    assertObject,
    assertString,
    assertStringArray,
    assertStringOrNumber,
    isNumber,
    isString
    } from "../../tools/type-guards"

export interface LoginResponse {
    id: string | number
    login: string
    name: string
    roles: string[]
}

export function assertLoginResponse(data: unknown): asserts data is LoginResponse {
    assertObject(data)
    const {id}=data
    assertStringOrNumber(data.id, "response.id")
    assertString(data.login, "response.login")
    assertString(data.name, "response.name")
    assertStringArray(data.roles, "response.roles")
}