import * as React from "react"
import LoginInfo from "./login-info"
import LoginService from "../../service/login"
import Modal from "../../ui/modal"
import Touchable from "../../ui/view/touchable"
import UserIcon from "../../ui/view/icons/user"
import { IUser } from "../../types/types"
import "./login-button-view.css"

export interface ILoginButtonViewProps {
    className?: string
    small?: boolean
    user: IUser | null
    onChange(user: IUser | null): void
}

export default function LoginButton(props: ILoginButtonViewProps) {
    const [user, setUser] = React.useState<null | IUser>(props.user)
    const [avatarURL, setAvatarURL] = React.useState("")
    const isLogged: boolean = !!user && user.id > 0
    const handleClick = async () => {
        if (isLogged && user) {
            const modal = new Modal(
                (
                    <LoginInfo
                        user={user}
                        avatarURL={avatarURL}
                        onClose={() => modal.hide}
                        onLogout={() => {
                            LoginService.logout().then(modal.hide)
                            setUser(null)
                        }}
                    />
                )
            )
            modal.show()
        } else {
            const user = await LoginService.login()
            setUser(user)
            props.onChange(user)
            if (user) {
                const avatarURL = await LoginService.getAvatarURL(user.id, 64)
                setAvatarURL(avatarURL)
            }
        }
    }
    React.useEffect(() => {
        if (!props.user) return

        LoginService.getAvatarURL(props.user.id, 64).then(setAvatarURL)
    }, [props.user])
    return (
        <Touchable
            className={getClassNames(props, isLogged)}
            onClick={handleClick}
        >
            <UserIcon />
            {isLogged && (
                <div
                    className="avatar"
                    style={{
                        backgroundImage: `url(${avatarURL})`,
                    }}
                />
            )}
        </Touchable>
    )
}

function getClassNames(
    props: ILoginButtonViewProps,
    isLogged: boolean
): string {
    const classNames = [
        "custom",
        "view-LoginButtonView",
        "theme-shadow-button",
        `theme-color-${isLogged ? "accent" : "primary"}`,
    ]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
