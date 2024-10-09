import * as React from "react"
import MinusOIcon from "../icons/minus-o"
import PlusOIcon from "../icons/plus-o"
import Touchable from "../touchable"
import { Icon } from "../icons/generic"
import { ThemeColorName, View, ViewWithChangeableValue } from "../types"
import { useChangeableValue } from "../../hooks/changeable-value"
import "./expand.css"

export type IExpandProps = View &
    ViewWithChangeableValue<boolean> & {
        label: string | JSX.Element | (string | JSX.Element)[]
        children: React.ReactNode
        expandedIcon?: Icon
        collapsedIcon?: Icon
        headColor?: ThemeColorName
        bodyColor?: ThemeColorName
    }

const ICON_SIZE = "2rem"

export default function Expand(props: IExpandProps) {
    const [value, setValue] = useChangeableValue(props)
    const handleToggleValue = () => {
        setValue(!value)
        if (props.onChange) props.onChange(!value)
    }

    const classes = [
        "custom",
        "tfw-view-Expand",
        "theme-shadow-button",
        getThemeColor(props.bodyColor),
        props.className ?? "",
    ]

    return (
        <div className={classes.join(" ")} tabIndex={0} aria-expanded={value}>
            <Touchable
                onClick={handleToggleValue}
                className={getThemeColor(props.headColor)}
            >
                <div className="head">
                    <div className="icons">
                        {(props.collapsedIcon ?? PlusOIcon)({})}
                        {(props.expandedIcon ?? MinusOIcon)({})}
                    </div>
                    {Array.isArray(props.label) ? (
                        <div className="label">
                            {props.label.map((item, idx) => (
                                <div key={idx}>{item}</div>
                            ))}
                        </div>
                    ) : (
                        props.label
                    )}
                </div>
            </Touchable>
            <div className="body">{props.children}</div>
        </div>
    )
}

function getThemeColor(color: string | undefined) {
    if (!color) return ""

    return `theme-color-${color}`
}
