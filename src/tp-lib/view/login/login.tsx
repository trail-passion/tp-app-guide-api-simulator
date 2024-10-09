import * as React from "react"
import AddIcon from "../../ui/view/icons/add"
import Button from "../../ui/view/button"
import castString from "../../tools/converter/string"
import ComboLang from "../../ui/view/combo-lang/combo-lang"
import Flex from "../../ui/view/flex"
import Input from "../../ui/view/input/text"
import MailIcon from "../../ui/view/icons/mail"
import Modal from "../../ui/modal"
import Service from "../../service/service"
import TpPasswordIcon from "../../ui/view/icons/tp-password"
import { TranslateLib as Translate } from "tp-lib/translate"
import UserIcon from "../../ui/view/icons/user"
import { isEMail } from "../../tools/type-guards"
import { useCurrentLanguage } from "../../ui/hooks/current-language"
import "./login.css"

export interface ILoginProps {
    title: string
    className?: string
    onLogin(username: string, password: string): void
    onForgotPassword(username: string): void
    onCreateAccount(username: string): void
}

export default function Login(props: ILoginProps) {
    const [lang, setLang] = useCurrentLanguage(Translate)
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")
    const valid = isEMail(username)
    const handleLogin = () => {
        if (!valid) return

        props.onLogin(username, password)
    }
    return (
        <div
            className={`tp-view-login theme-color-frame ${
                props.className ?? ""
            }`}
        >
            <main>
                <ComboLang
                    wide={true}
                    languages={Translate.$availableLanguages}
                    value={Translate.$lang}
                    onChange={setLang}
                />
                <Input
                    wide={true}
                    name="username"
                    type="email"
                    focus={true}
                    label={Translate.emailAddress}
                    value={username}
                    onChange={setUsername}
                />
                <Input
                    wide={true}
                    name="password"
                    label={Translate.password}
                    value={password}
                    type="password"
                    onChange={setPassword}
                    onEnterPressed={handleLogin}
                />
                <Flex justifyContent="flex-end">
                    <Button
                        icon={UserIcon}
                        wide={true}
                        reversed={true}
                        error={valid ? undefined : Translate.invalidEmail}
                        enabled={valid}
                        label={Translate.login}
                        onClick={handleLogin}
                    />
                </Flex>
                <br />
                <Button
                    wide={true}
                    icon={TpPasswordIcon}
                    flat={true}
                    label={Translate.forgotPassword}
                    onClick={props.onForgotPassword}
                />
                <Button
                    wide={true}
                    icon={AddIcon}
                    flat={true}
                    label={Translate.createAccount}
                    onClick={props.onCreateAccount}
                />
            </main>
            <footer className="theme-color-section">
                <p>{Translate.emailUsageDisclaimer}</p>
            </footer>
        </div>
    )
}

interface ILoginState {
    valid: boolean
    username: string
    password: string
    lang: string
}

class Login666 extends React.Component<ILoginProps, ILoginState> {
    constructor(props: ILoginProps) {
        super(props)
        this.state = {
            valid: false,
            username: "",
            password: "",
            lang: Translate.$lang,
        }
    }

    handleUsernameChange = (username: string) => {
        this.setState({ username })
    }

    handlePasswordChange = (password: string) => {
        this.setState({ password })
    }

    handleValidation = (validation: boolean | string) => {
        this.setState({ valid: validation === true })
    }

    handleLogin = () => {
        if (!this.state.valid) return

        const handler = this.props.onLogin
        if (typeof handler !== "function") return
        try {
            const { username, password } = this.state
            handler(username, password)
        } catch (ex) {
            console.error("Error in handleLogin(): ")
            console.error(ex)
        }
    }

    handleForgotPassword = () => {
        if (!this.state.valid) {
            Modal.error(Translate.missingEmail)
            return
        }
        const handler = this.props.onForgotPassword
        if (typeof handler !== "function") return this.askPassword()
        try {
            handler(this.state.username)
        } catch (ex) {
            console.error("Error in handleForgotPassword(): ")
            console.error(ex)
        }
    }

    handleCreateAccount = () => {
        if (!this.state.valid) {
            Modal.error(Translate.missingEmail)
            return
        }
        const handler = this.props.onCreateAccount
        if (typeof handler !== "function") return this.askPassword()
        try {
            handler(this.state.username)
        } catch (ex) {
            console.error("Error in handleCreateAccount(): ")
            console.error(ex)
        }
    }

    handleLanguageChange = (lang: string) => {
        Translate.$lang = lang
        this.setState({ lang })
    }

    private askPassword = async () => {
        try {
            const { username } = this.state
            await Service.exec("tp4.NewAccount", { mail: username })
            Modal.error(
                <div>
                    <div>{Translate.emailSent}</div>
                    <code>{username}</code>
                </div>
            )
        } catch (ex) {
            console.error(ex)
            Modal.error(
                <div>
                    {Translate.errorContactSupport}
                    <br />
                    <a href="mailto:contact@trail-passion.net">
                        contact@trail-passion.net
                    </a>
                </div>
            )
        }
    }

    render() {
        const { username, password } = this.state
        const className = `${castString(
            this.props.className,
            ""
        )} tp-view-login theme-shadow-header`

        return (
            <div className={className}>
                <div>
                    <header className="theme-shadow-button theme-color-primary-dark">
                        {this.props.title}
                    </header>
                    <div className="theme-color-frame">
                        <ComboLang
                            label={Translate.language}
                            value={this.state.lang}
                            languages={["fr", "en", "it"]}
                            onChange={this.handleLanguageChange}
                        />
                        <Input
                            name="tp-username"
                            label={Translate.emailAddress}
                            validator={isEMail}
                            error={Translate.invalidEmail}
                            onChange={this.handleUsernameChange}
                            onValidation={this.handleValidation}
                            wide={true}
                            value={username}
                            focus={true}
                        />
                        <Input
                            name="tp-password"
                            label={Translate.password}
                            onChange={this.handlePasswordChange}
                            type="password"
                            wide={true}
                            onEnterPressed={this.handleLogin}
                            value={password}
                        />
                        <Flex justifyContent="flex-end">
                            <Button
                                icon={UserIcon}
                                wide={true}
                                reversed={true}
                                error={Translate.invalidEmail}
                                enabled={this.state.valid}
                                label={Translate.login}
                                onClick={this.handleLogin}
                            />
                        </Flex>
                        <hr />
                        <Flex dir="column">
                            <Button
                                wide={true}
                                icon={MailIcon}
                                flat={true}
                                label={Translate.forgotPassword}
                                onClick={this.handleForgotPassword}
                            />
                            <Button
                                wide={true}
                                icon={AddIcon}
                                flat={true}
                                label={Translate.createAccount}
                                onClick={this.handleCreateAccount}
                            />
                        </Flex>
                    </div>
                    <footer className="theme-color-screen">
                        <p>{Translate.emailUsageDisclaimer}</p>
                    </footer>
                </div>
            </div>
        )
    }
}
