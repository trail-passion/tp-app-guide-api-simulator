import * as React from "react"
import Touchable from "../../ui/view/touchable"
import "./trace-button.css"

interface ITraceButtonProps {
    id: number
    name: string
    grp: string
    vignette?: boolean
    asc?: number
    dsc?: number
    km?: number
    onClick?: (id: number) => void
}

export default class TraceButton extends React.Component<
    ITraceButtonProps,
    {}
> {
    constructor(props: ITraceButtonProps) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        const handler = this.props.onClick
        if (typeof handler !== "function") return
        try {
            handler(this.props.id)
        } catch (ex) {
            console.error("Error in handleClick(): ")
            console.error(ex)
        }
    }

    render() {
        return (
            <Touchable
                onClick={this.handleClick}
                className="tp-view-TraceButton theme-color-primary theme-shadow-button"
            >
                <div className="group">
                    <div>{this.props.grp}</div>
                    <div>
                        <b>{this.props.asc}</b> D+
                    </div>
                    <div>
                        <b>{this.props.dsc}</b> D-
                    </div>
                    <div>
                        <b>{this.props.km}</b> km
                    </div>
                    <div>{`#${this.props.id}`}</div>
                </div>
                <div className="name">{this.props.name}</div>
            </Touchable>
        )
    }
}
