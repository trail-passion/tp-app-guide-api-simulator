import * as React from "react"
import { TranslateLib as Translate } from "tp-lib/translate"
import Input from "../../ui/view/input/text"
import "./change-password-view.css"

export interface IChangePasswordViewProps {
    className?: string
    nickname: string
    onChange(
        valid: boolean,
        nickname: string,
        oldPassword: string,
        newPassword: string
    ): void
}

interface State {
    nickname: string
    oldPassword: string
    newPassword1: string
    newPassword2: string
}

export default function ChangePasswordView(props: IChangePasswordViewProps) {
    const { className } = props
    const [data, setData] = React.useState({
        nickname: props.nickname,
        oldPassword: "",
        newPassword1: "",
        newPassword2: "",
    })
    const { nickname, oldPassword, newPassword1, newPassword2 } = data
    const classNames = ["custom", "view-ChangePasswordView"]
    if (typeof className === "string") {
        classNames.push(className)
    }
    let valid = true
    let error = ""
    if (newPassword1 !== newPassword2) {
        error = Translate.noMatch
        valid = false
    } else if (newPassword1.length < 6) {
        error = Translate.passwordTooShort
        valid = false
    }
    const update = (state: Partial<State>) => {
        const newData = { ...data, ...state }
        setData(newData)
        props.onChange(
            valid,
            newData.nickname,
            newData.oldPassword,
            newData.newPassword1
        )
    }
    return (
        <div className={classNames.join(" ")}>
            <section>
                <Input
                    label={Translate.nickname}
                    wide={true}
                    value={nickname}
                    onChange={(nickname: string) => update({ nickname })}
                />
                <Input
                    label={Translate.oldPassword}
                    wide={true}
                    value={oldPassword}
                    type="password"
                    onChange={(oldPassword: string) => update({ oldPassword })}
                />
                <hr />
                <Input
                    label={Translate.newPassword}
                    wide={true}
                    value={newPassword1}
                    type="password"
                    onChange={(newPassword1: string) =>
                        update({ newPassword1 })
                    }
                />
                <Input
                    label={Translate.newPasswordRepeat}
                    wide={true}
                    value={newPassword2}
                    type="password"
                    onChange={(newPassword2: string) =>
                        update({ newPassword2 })
                    }
                />
                <div
                    className={`error theme-color-error ${
                        valid ? "hide" : "show"
                    }`}
                >
                    <div>{error}</div>
                </div>
            </section>
        </div>
    )
}
