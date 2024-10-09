import { IUser } from "../../types/types"
import Service from "../service"

export async function getUserInfo(userId: number): Promise<IUser | null> {
    const user = Service.exec("tp.user.info", { id: userId })
    if (!isUserInfoMessage(user)) return null

    return {
        id: user.id,
        login: user.login,
        password: user.password,
        nickname: user.nickname,
        enabled: user.enabled,
        roles: user.roles,
        data: user.data,
    }
}

interface IUserInfoMessage {
    id: number
    login: string
    password: string
    nickname: string
    roles: string[]
    enabled: boolean
    creation: number
    data: any
}

function isUserInfoMessage(data: any): data is IUserInfoMessage {
    if (!data) return false
    if (typeof data !== "object") return false

    const { id, login, password, nickname, roles, enabled, creation } = data
    if (typeof id !== "number") return false
    if (typeof login !== "string") return false
    if (typeof password !== "string") return false
    if (typeof nickname !== "string") return false
    if (!Array.isArray(roles)) return false
    if (typeof enabled !== "boolean") return false
    if (typeof creation !== "number") return false

    return true
}
