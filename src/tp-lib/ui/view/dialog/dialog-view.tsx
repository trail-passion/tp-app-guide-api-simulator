import * as React from "react"
import Button from "../button"
import { Icon } from "../icons/generic"
import { ThemeColorName } from "../types"
import MountainsUrl from "./mountains.webp"

import "./dialog-view.css"

export interface DialogViewProps {
    className?: string
    /** If a `title` is defined, a dark primary header will be displayed. */
    title?: string
    /** If title is defined, you can add an icon to its left. */
    icon?: Icon
    /** If `false`, __OK__ button will be disabled. */
    valid?: boolean
    /** Use flat button for cancel, or if there is only one button. */
    flat?: boolean
    children?: React.ReactNode
    /** Triggered when __OK__ button has been clicked */
    onOK?(): void
    /** Triggered when __Cancel__ button has been clicked */
    onCancel?(): void
    /** If `true` don't display any __Cancel__ button. */
    hideCancel?: boolean
    /** If `true` don't display any __OK__ button. */
    hideOK?: boolean
    /** Rename the __OK__ button. */
    labelOK?: string
    /** Color of OK button. Default to primary. */
    colorOK?: ThemeColorName
    /** Rename the __Cancel__ button. */
    labelCancel?: string
    maxWidth?: string
    /** Prefered width. Default to "auto". **/
    width?: string
}

export default function DialogView(props: DialogViewProps) {
    const {
        colorOK,
        flat,
        title,
        icon,
        valid,
        children,
        hideCancel,
        hideOK,
        labelOK,
        labelCancel,
        onOK,
        onCancel,
    } = props

    return (
        <div
            className={getClassNames(props)}
            style={{
                maxWidth: props.maxWidth ?? "100vw",
                width: props.width ?? "auto",
            }}
        >
            {title && (
                <header>
                    {icon && icon({})}
                    <div>{title}</div>
                </header>
            )}
            <div>{extractErrorMessageIfNeeded(children)}</div>
            {(!hideOK || !hideCancel) && (
                <footer
                    style={{
                        backgroundImage: `url(${MountainsUrl})`,
                    }}
                >
                    {!(hideCancel ?? false) && (
                        <Button
                            wide={true}
                            label={labelCancel ?? "Cancel"}
                            onClick={onCancel}
                            flat={true}
                        />
                    )}
                    {!(hideOK ?? false) && (
                        <Button
                            wide={true}
                            color={colorOK ?? "primary"}
                            enabled={valid ?? true}
                            label={labelOK ?? "Ok"}
                            onClick={onOK}
                            flat={hideCancel && flat}
                        />
                    )}
                </footer>
            )}
        </div>
    )
}

function getClassNames(props: DialogViewProps): string {
    const classNames = ["custom", "ui-view-DialogView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function extractErrorMessageIfNeeded(
    children: React.ReactNode | Error
): React.ReactNode {
    if (children instanceof Error) return children.message
    return children
}
