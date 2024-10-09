import * as React from "react"
import { createRoot } from "react-dom/client"
import LoginView from "../../view/login"
import Modal from "../../ui/modal"
import Service, { EnumLoginError } from "../service"
import { TranslateLib as Translate } from "tp-lib/translate"
import { inputString } from "../../ui/input"
import { isEMail, isNumber, isString } from "../../tools/type-guards"
import { IUser } from "../../types/types"
import "./login.css"

const OK = 0
const ERR_NOT_LOGGED = -1
const ERR_WRONG_PASSWORD = -2
const ERR_NICKNAME_ALREADY_EXISTS = -3
const ERR_MAIL_NOT_SENT = -8
const ERR_MISSING_MANDATORY_ATTRIBUTE = -9

export default {
    getCurrentUser,
    getAvatarURL,
    changePassword,
    login,
    logout,
    OK,
    ERR_NOT_LOGGED,
    ERR_WRONG_PASSWORD,
    ERR_NICKNAME_ALREADY_EXISTS,
    ERR_MAIL_NOT_SENT,
    ERR_MISSING_MANDATORY_ATTRIBUTE,
}

const EMPTY_USER: IUser = {
    id: -1,
    login: "",
    password: "",
    nickname: "...",
    enabled: false,
    roles: [],
    data: {},
}

export interface IGetCurrentUserArgs {
    /** Array of mandatory roles for the current user. */
    requiredGrants?: string[]
    /**
     * If the login input form has be popup,
     * it will insert itself in `container` if defined.
     */
    container?: HTMLElement | null
}

/**
 * The user asks to change its password and maybe its nickname.
 * The result is an error code. 0 means OK.
 */
async function changePassword(
    oldPwd: string,
    newPwd: string,
    nickname?: string
): Promise<number> {
    const errorCode = await Service.exec("tp4.ChangePwd", {
        nck: nickname,
        old: oldPwd,
        new: newPwd,
    })
    if (isNumber(errorCode)) return errorCode

    console.error("tp4.ChangePwd returned invalid data:", errorCode)
    return -999
}

async function logout(reloadPage: boolean = false) {
    try {
        await Service.logout()
    } catch (ex) {
        console.error("Unable to logout!", ex)
    } finally {
        if (reloadPage) {
            window.location.reload()
        }
    }
}

async function getLogin(
    username: string,
    password: string
): Promise<IUser | null> {
    try {
        const user = await Service.login(username, password)
        if (!user) return null

        return {
            ...EMPTY_USER,
            id: user.id,
            login: user.email,
            nickname: user.nickname,
            roles: user.roles.slice(),
        }
    } catch (ex) {
        if (ex === EnumLoginError.WRONG_PASSWORD) {
            console.error(`Wrong password for user "${username}"!`)
        } else {
            console.error(ex)
        }
    }
    return null
}

/**
 * Try an autologin and retrieve the currently logged user.
 * The login form will appear (only if needed):
 *
 * # inside `container`,
 * # inside an element with id "login",
 * # or as a modal window at the center of the screen.
 */
async function getCurrentUser(
    args: IGetCurrentUserArgs = {}
): Promise<IUser | null> {
    if (await checkAuthenticationToken()) return null

    const requiredGrants = args.requiredGrants ?? []

    return new Promise(async (resolve) => {
        if (isHTMLElement(args.container)) {
            args.container.classList.add("tp-service-Login")
        } else {
            args.container = document.getElementById("login")
        }
        const { username, password } = Service.lastSuccessfulLogin
        const user = await getLogin(username, password)
        if (user && hasRoles(user, ...requiredGrants)) {
            resolve(user)
            return
        }

        if (requiredGrants.length > 0) {
            const onLogin = async (
                inputLogin: string,
                inputPassword: string
            ) => {
                await handleLogin(args, resolve, inputLogin, inputPassword)
            }
            const onForgotPassword = (username: string) => {}
            const onCreateAccount = (username: string) => {}

            if (isHTMLElement(args.container)) {
                const view = (
                    <LoginView
                        title={`Trail-Passion`}
                        onLogin={onLogin}
                        onCreateAccount={onCreateAccount}
                        onForgotPassword={onForgotPassword}
                    />
                )
                const { container } = args
                if (container) {
                    createRoot(container).render(view)
                    container.classList.add("show")
                }
            } else {
                const modal = new Modal({
                    content: (
                        <LoginView
                            title={`Trail-Passion`}
                            onLogin={async (
                                inputLogin: string,
                                inputPassword: string
                            ) => {
                                modal.hide()
                                await onLogin(inputLogin, inputPassword)
                            }}
                            onCreateAccount={onCreateAccount}
                            onForgotPassword={onForgotPassword}
                        />
                    ),
                    autoClosable: false,
                    onClose: () => resolve(null),
                    align: "BL",
                })
                modal.show()
            }
        } else {
            resolve(null)
        }
    })
}

function hasRoles(user: IUser, ...requiredGrants: string[]): boolean {
    for (const role of requiredGrants) {
        if (!user.roles.includes(role.toUpperCase())) {
            return false
        }
    }

    return true
}

async function login(requiredGrants: string[] = []): Promise<IUser | null> {
    return new Promise((resolve) => {
        const modal = new Modal(
            (
                <LoginView
                    title={`Trail-Passion`}
                    onLogin={async (
                        inputLogin: string,
                        inputPassword: string
                    ) => {
                        modal.hide()
                        const user = await getLogin(inputLogin, inputPassword)
                        if (user && hasRoles(user, ...requiredGrants)) {
                            Service.lastSuccessfulLogin = {
                                username: inputLogin,
                                password: inputPassword,
                            }
                            resolve(user)
                        } else {
                            resolve(null)
                        }
                    }}
                    onForgotPassword={async (username) => {
                        if (await handleForgotPassword(username)) modal.hide()
                    }}
                    onCreateAccount={handleCreateAccount}
                />
            )
        )
        modal.show()
    })
}

async function handleForgotPassword(username: string): Promise<boolean> {
    const email = await inputString({
        name: "username",
        label: Translate.emailAddress,
        title: Translate.forgotPassword,
        extraContent: (
            <p>Entrez l'adresse mail pour recevoir votre mot de passe.</p>
        ),
        validator: isEMail,
    })
    if (!isEMail(email)) return false
    return true
}
function handleCreateAccount(username: string) {}

async function handleLogin(
    args: IGetCurrentUserArgs,
    resolve: (user: IUser) => void,
    username: string,
    password: string
) {
    const requiredGrants = args.requiredGrants ?? []

    if (isHTMLElement(args.container)) {
        // Hide the container, if any.
        const ANIMATION_DELAY = 300
        const container = args.container
        container.classList.remove("show")
        container.classList.add("hide")
        window.setTimeout(() => {
            container.innerHTML = ""
        }, ANIMATION_DELAY)
    }
    const user = await getLogin(username, password)
    if (user) {
        if (hasRoles(user, ...requiredGrants)) {
            Service.lastSuccessfulLogin = { username, password }
            resolve(user)
        } else {
            await Modal.error(<div>{Translate.userIsNotGranted}</div>)
            window.location.reload()
            return
        }
    } else {
        await Modal.error(<div>{Translate.badLogin}</div>)
        window.location.reload()
        return
    }
}

function isHTMLElement(value?: HTMLElement | null): value is HTMLElement {
    if (value === null) return false
    if (typeof value === "undefined") return false
    return true
}

// Cache for avatar MD5 ids.
const globalCacheMD5 = new Map<string | number, string>()

/**
 * Return the URL to the avatar of the current user.
 */
async function getAvatarURL(
    userIdOrNickname: string | number,
    size: 32 | 64 | 128 | 256 | 512 = 64
): Promise<string> {
    const md5 = await getUserMD5(userIdOrNickname)
    return `https://secure.gravatar.com/avatar/${md5}?s=${size}&r=pg&d=retro`
}

async function getUserMD5(userIdOrNickname: string | number): Promise<string> {
    const fromCache = globalCacheMD5.get(userIdOrNickname)
    if (fromCache) return fromCache

    const md5 = await Service.exec("md5", userIdOrNickname)
    if (!isString(md5)) {
        console.error("md5 returned invalid data:", md5)
        throw Error("Unable to get MD5 for user!")
    }
    globalCacheMD5.set(userIdOrNickname, md5)
    return md5
}

/**
 * Check if the URL has an authentication token for autologin.
 * If so, autoconnect and return true.
 */
async function checkAuthenticationToken(): Promise<boolean> {
    const args = new URLSearchParams(window.location.search)
    if (!args.has("tkn")) return false
    if (!args.has("key")) return false
    if (!args.has("usr")) return false

    try {
        const tkn = args.get("tkn") as string
        const key = args.get("key") as string
        const username = args.get("usr") as string
        const password = await Service.exec("tp4.Token", { tkn, key })
        if (!isString(password)) {
            console.error("tp4.Token returned invalid data:", password)
            return false
        }
        Service.lastSuccessfulLogin = { username, password }
        return true
    } catch (ex) {
        console.error("Bad token!", ex)
        return false
    } finally {
        args.delete("tkn")
        args.delete("key")
        args.delete("usr")
        window.location.search = `?${args.toString()}`
    }
}
