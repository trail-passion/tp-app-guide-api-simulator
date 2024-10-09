import * as React from "react"
import LoginService from "../../service/login"
import "./avatar-view.css"


export interface AvatarViewProps {
    className?: string
    userIdOrNickname: number | string
}

export default function AvatarView(props: AvatarViewProps) {
    const [loaded, setLoaded] = React.useState(false)
    const [src, setSrc] = React.useState("")
    React.useEffect(() => {
        setLoaded(false)
        LoginService.getAvatarURL(props.userIdOrNickname, 128)
            .then(setSrc)
            .catch(console.error)
    }, [props.userIdOrNickname])
    return (
        <img
            className={getClassNames(props)}
            src={src}
            onLoad={() => setLoaded(true)}
        />
    )
}

function getClassNames(props: AvatarViewProps): string {
    const classNames = ["custom", "view-AvatarView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
