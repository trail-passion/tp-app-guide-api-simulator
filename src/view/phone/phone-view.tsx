import Button from "tp-lib/ui/view/button"
import IconBack from "tp-lib/ui/view/icons/back"
import IconOrientation from "tp-lib/ui/view/icons/orientation"
import IconRefresh from "tp-lib/ui/view/icons/refresh"
import React from "react"
import "./phone-view.css"

interface IPhoneProps {
    className?: string
    onBack(): void
    onRefresh(): void
    children: JSX.Element | JSX.Element[]
}

export default function Phone(props: IPhoneProps) {
    const { className, onBack, onRefresh } = props
    const [portrait, setPortrait] = React.useState(true)
    const classes = (className ?? "").split(" ")
    classes.push("tour-view-phone")
    if (!portrait) classes.push("landscape")
    return (
        <div className={classes.join(" ")}>
            <div className="theme-color-screen">{props.children}</div>
            <div className="shadow"></div>
            <nav>
                <div></div>
                <Button icon={IconBack} onClick={onBack} />
                <Button
                    icon={IconOrientation}
                    onClick={() => setPortrait(!portrait)}
                />
                <Button icon={IconRefresh} onClick={onRefresh} />
                <div></div>
            </nav>
        </div>
    )
}
