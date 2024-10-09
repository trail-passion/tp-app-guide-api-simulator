const CREDENTIALS_KEY = "tfw/web-service/login"
// Encryption of the username/password starts with the length of the username.
// To makes it appear like a letter, we add ENCRYPTION_SHIFT_FOR_USERNAME_LENGTH.
const ENCRYPTION_SHIFT_FOR_USERNAME_LENGTH = 64
// N and P must be primes and N > P.
const ENCRYPTION_N = 47
const ENCRYPTION_P = 37

export interface ILogin {
    username: string
    password: string
}

export default { clear, get, set }

function get(): ILogin {
    try {
        const code = window.localStorage.getItem(CREDENTIALS_KEY)
        if (typeof code !== "string") {
            throw `Code should be a string but we got ${typeof code}!`
        }
        const arr = JSON.parse(window.atob(code))
        if (!Array.isArray(arr)) throw "Bad storage!"
        let username = ""
        let password = ""
        const usernameLength =
            arr.shift() - ENCRYPTION_SHIFT_FOR_USERNAME_LENGTH
        let index = 27
        for (let i = 0; i < usernameLength; i++) {
            const shift = (index++ * ENCRYPTION_P) % ENCRYPTION_N
            username += String.fromCharCode(arr.shift() - shift)
        }
        while (arr.length > 0) {
            const shift = (index++ * ENCRYPTION_P) % ENCRYPTION_N
            password += String.fromCharCode(arr.shift() - shift)
        }

        return { username, password }
    } catch (ex) {
        console.error(ex)
        return {
            username: "",
            password: "",
        }
    }
}

function set(login: ILogin) {
    const arr = [ENCRYPTION_SHIFT_FOR_USERNAME_LENGTH + login.username.length]
    let index = 27
    for (const c of login.username) {
        const shift = (index++ * ENCRYPTION_P) % ENCRYPTION_N
        arr.push(c.charCodeAt(0) + shift)
    }
    for (const c of login.password) {
        const shift = (index++ * ENCRYPTION_P) % ENCRYPTION_N
        arr.push(c.charCodeAt(0) + shift)
    }
    const code = window.btoa(JSON.stringify(arr))
    window.localStorage.setItem(CREDENTIALS_KEY, code)
}

function clear() {
    const MIN_CHAR = 32
    const MAX_CHAR = 127
    const MIN_SIZE = 10
    const MAX_SIZE = 32
    const size = Math.floor(Math.random() * (MAX_SIZE - MIN_SIZE))
    let password = ""
    for (let i = 0; i < size; i++) {
        password += String.fromCharCode(
            MIN_CHAR + Math.floor((MAX_CHAR - MIN_CHAR) * Math.random())
        )
    }
    set({ username: "", password })
}
