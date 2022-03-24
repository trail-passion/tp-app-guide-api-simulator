import * as React from "react"
import * as ReactDOM from "react-dom"
import App from "./view/app"
import "./index.css"

async function start() {
    ReactDOM.render(<App />, document.getElementById("root"))
}

start()
