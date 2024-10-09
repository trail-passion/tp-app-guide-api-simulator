import * as React from "react"
import Button from "../../../ui/view/button"
import ChangePassword from "../../change-password"
import CloseIcon from "../../../ui/view/icons/close"
import Dialog from "../../../ui/view/dialog"
import Flex from "../../../ui/view/flex"
import LoginService from "../../../service/login"
import LogoutIcon from "../../../ui/view/icons/logout"
import Modal from "../../../ui/modal"
import TpPasswordIcon from "../../../ui/view/icons/tp-password"
import { TranslateLib as Translate } from "tp-lib/translate"
import UserIcon from "../../../ui/view/icons/user"
import { IUser } from "../../../types/types"
import "./login-info-view.css"

export interface LoginInfoViewProps {
    className?: string
    user: IUser
    avatarURL: string
    onClose(): void
    onLogout(): void
}

export default function LoginInfoView(props: LoginInfoViewProps) {
    const { user } = props
    const [avatarURL, setAvatarURL] = React.useState(props.avatarURL)
    // We load a better resolution of the avatar.
    React.useEffect(() => {
        LoginService.getAvatarURL(user.id, 256).then(setAvatarURL)
    }, [props.user])
    const handlePersonalSpace = () => {
        window.location.href = "/user.html"
    }
    const handleChangePassword = () => {
        const data = {
            nickname: "",
            oldPassword: "",
            newPassword: "",
            valid: false,
        }
        const dialog = new Modal(
            (
                <Dialog
                    title={Translate.changePassword}
                    icon={TpPasswordIcon}
                    onOK={async () => {
                        if (
                            await Modal.wait(
                                Translate.changePassword,
                                changePassword(
                                    data.oldPassword,
                                    data.newPassword,
                                    data.nickname
                                )
                            )
                        ) {
                            dialog.hide()
                        }
                    }}
                >
                    <ChangePassword
                        nickname={user.nickname}
                        onChange={(
                            valid,
                            oldPassword,
                            newPassword,
                            nickname
                        ) => {
                            data.valid = valid
                            data.oldPassword = oldPassword
                            data.newPassword = newPassword
                            data.nickname = nickname
                        }}
                    />
                </Dialog>
            )
        )
        dialog.show()
    }
    return (
        <div className={getClassNames(props)}>
            <header>{user.nickname}</header>
            <Button
                label={Translate.personalSpace}
                icon={UserIcon}
                wide={true}
                onClick={handlePersonalSpace}
            />
            <div className="center">
                <img src={avatarURL} width="256" height="256" />
            </div>
            <Button
                label={Translate.changePassword}
                icon={TpPasswordIcon}
                wide={true}
                onClick={handleChangePassword}
            />
            <footer>
                <Button
                    icon={LogoutIcon}
                    label={Translate.logout}
                    onClick={() => {
                        props.onClose()
                        props.onLogout()
                    }}
                    color="accent"
                />
                <Button
                    icon={CloseIcon}
                    flat={true}
                    label={Translate.close}
                    onClick={() => props.onClose()}
                />
            </footer>
        </div>
    )
}

function getClassNames(props: LoginInfoViewProps): string {
    const classNames = [
        "custom",
        "view-loginButton-LoginInfoView",
        "theme-color-frame",
    ]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

async function changePassword(
    oldPwd: string,
    newPwd: string,
    nickname: string
) {
    const errorCode = await LoginService.changePassword(
        oldPwd,
        newPwd,
        nickname
    )
    switch (errorCode) {
        case LoginService.OK:
            return true
        // If the mail has not beeen sent, this is not a major failure.
        case LoginService.ERR_MAIL_NOT_SENT:
            return true
        case LoginService.ERR_NICKNAME_ALREADY_EXISTS:
            return fatal(Translate.errorNicknameExists)
        case LoginService.ERR_WRONG_PASSWORD:
            return fatal(Translate.errorWrongPassword)
        default:
            window.open("mailto:contact@trail-passion.net")
            return fatal(Translate.errorUnknown)
    }
}

function fatal(msg: string): boolean {
    Modal.error(msg)

    return false
}
