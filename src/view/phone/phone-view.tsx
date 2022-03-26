import Button from "tp-lib/ui/view/button"
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
    const classes = (className ?? '').split(' ')
    classes.push('tour-view-phone')
    if (!portrait) classes.push('landscape')
    return (
        <div className={classes.join(' ')}>
            <div className="theme-color-screen">{props.children}</div>
            <div className="shadow"></div>
            <nav>
                <div></div>
                <Button icon="back" onClick={onBack} />
                <Button
                    icon="orientation"
                    onClick={() => setPortrait(!portrait)}
                />
                <Button icon="refresh" onClick={onRefresh} />
                <div></div>
            </nav>
        </div>
    )
}
