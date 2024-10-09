import Encryption, { ILogin } from "./encryption"
import GenericEvent from "../../tools/generic-event"
import User from "./user"
import { assertLoginResponse } from "./type"
import { assertNumberArray } from "../../tools/type-guards"
export type { ILogin } from "./encryption"

export const EnumWebServiceError = {
    OK: 0,
    BAD_ROLE: 1,
    BAD_TYPE: 2,
    CONNECTION_FAILURE: 3,
    MISSING_AUTOLOGIN: 4,
    UNKNOWN_USER: 5,
    HTTP_ERROR: 6,
}

export const EnumLoginError = {
    WRONG_CHALLENGE: -1,
    MISSING_WAITING_STATE: -2, // USER:waiting.
    MISSING_RESPONSE_STATE: -3, // USER:response.
    WRONG_LENGTH: -4, // Response has not the correct length.
    WRONG_PASSWORD: -5,
    ACCOUNT_DISABLED: -6,
}

interface ICallResponse {
    code: number // EnumWebServiceError
    data: any
}

class Service {
    private _user: User | null = null

    public readonly eventUserChange = new GenericEvent<User | null>()

    public constructor(private root: string = "") {
        if (this.root.charAt(this.root.length - 1) !== "/") {
            this.root += "/"
        }
    }

    public get user() {
        return this._user
    }

    private set user(value: User | null) {
        this._user = value
        this.eventUserChange.fire(value)
    }

    get lastSuccessfulLogin() {
        return Encryption.get()
    }

    set lastSuccessfulLogin(lastLogin: ILogin) {
        if (lastLogin.username === "") {
            Encryption.clear()
        } else {
            Encryption.set(lastLogin)
        }
    }

    public async exec(name: string, args: any = null): Promise<unknown> {
        try {
            const response: ICallResponse = await this.callService(name, args)
            if (response.code === EnumWebServiceError.OK) {
                const { data } = response
                if (data && data.charAt(0) === "!") {
                    // When the answer is not a JSON, but a string starting with "!",
                    // that means that the service requires authentification.
                    // What follow the "!" is the name of the needed role.
                    // For instance: !ADMIN
                    throw EnumWebServiceError.BAD_ROLE
                }
                const obj = JSON.parse(data)
                return obj
            }
            throw response
        } catch (ex) {
            console.error(`Unable to call service "${name}" with args:`, args)
            throw ex
        }
    }

    public getAbsoluteUrl(url: string): string {
        if (typeof url !== "string") return url
        if (url.startsWith("https://") || url.startsWith("http://")) return url

        return `${this.root}${url}`
    }

    public async login(username: string, password: string): Promise<User> {
        const challenge = await this.exec("tfw.login.Challenge", username)
        assertNumberArray(challenge)
        const h = hash(challenge, password)
        const response = await this.exec("tfw.login.Response", h)
        if (typeof response === "number") {
            throw response
        }
        assertLoginResponse(response)
        this.lastSuccessfulLogin = { username, password }

        const user = new User(
            parseInt(`${response.id}`, 10),
            response.login,
            response.name,
            response.roles
        )
        this.user = user
        return user
    }

    public async logout() {
        this.lastSuccessfulLogin = { username: "", password: "" }
        this.user = null
        await this.exec("tww.login.Logout")
    }

    public setRoot(root: string) {
        this.root = root
    }

    private async callService(name: string, args: {}): Promise<ICallResponse> {
        // const data = new FormData()
        // data.append("s", name)
        // data.append("i", JSON.stringify(args))
        const url = `${this.root}tfw/svc.php`
        const init: RequestInit = {
            body: JSON.stringify({ s: name, i: args }),
            mode: "cors",
            method: "POST",
            cache: "no-cache",
            redirect: "follow",
            referrerPolicy: "no-referrer",
            headers: {
                "Content-Type": "application/json",
            },
        }
        const response = await fetch(url, init)
        if (response.ok) {
            return {
                code: EnumWebServiceError.OK,
                data: await response.text(),
            }
        }

        console.error("HTTP ERROR:", response)
        console.error(`For service "name" with params:`, args)
        return {
            code: EnumWebServiceError.HTTP_ERROR,
            data: response.statusText,
        }
    }
}

function hash(code: number[], pwd: string): number[] {
    const output = Array(16).fill(0)
    const pass: number[] = []

    for (let i = 0; i < pwd.length; i++) {
        pass.push(pwd.charCodeAt(i))
    }
    if (256 % pass.length === 0) {
        pass.push(0)
    }

    let j = 0
    for (let i = 0; i < 256; i++) {
        output[i % 16] ^= i + pass[i % pass.length]
        const k1 = code[j++ % code.length] % 16
        const k2 = code[j++ % code.length] % 16
        const k3 = code[j++ % code.length] % 16
        output[k3] ^= (output[k3] + 16 * k2 + k3) % 256
        output[k2] ^= (output[k1] + output[k3]) % 256
    }

    return output
}

// ==================
// Default instance
// ------------------

const gInstance = new Service()

export default gInstance
