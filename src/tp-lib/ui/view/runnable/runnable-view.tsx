import * as React from "react"
import "./runnable-view.css"
import { Logo } from "./logo"

export interface RunnableViewProps {
    className?: string
    running: boolean
    children: React.ReactNode
}

/**
 * Use this component around inputs you want to disable during some running refresh.
 * It can be used with forms that trigger network queries, for instance.
 * @param props.running If `true` a "refresh" animation is displayed and the content
 * is not touchable.
 */
export default function RunnableView(props: RunnableViewProps) {
    return (
        <div className={getClassNames(props)}>
            <div className="children">{props.children}</div>
            <div className="overlay">
                {props.running && (
                    <>
                        <Path color="#000" width="24" />
                        <Path color="#f90" width="18" />
                        <Logo />
                    </>
                )}
            </div>
        </div>
    )
}

function getClassNames(props: RunnableViewProps): string {
    const classNames = ["custom", "ui-view-RunnableView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (props.running) classNames.push("running")

    return classNames.join(" ")
}

function Path(props: { color: string; width: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="100%"
            width="100%"
            version="1.1"
            viewBox="-200 -200 400 400"
            preserveAspectRatio="xMidYMid"
        >
            <path
                d="M100,0 A100 100 0 1 1 0 -100"
                stroke={props.color}
                stroke-width={props.width}
                fill="none"
                stroke-dasharray="300 1000"
                stroke-dashoffset="0"
                stroke-linecap="round"
            >
                <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from="0 0 0"
                    to="360 0 0"
                    dur=".83s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="stroke-dashoffset"
                    values="0;280;0"
                    dur="1.1s"
                    repeatCount="indefinite"
                />
            </path>
        </svg>
    )
}
