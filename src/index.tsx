import * as React from "react"
import * as ReactDOM from "react-dom"
import App from "./view/app"
import LoginService from "tp-lib/service/login"
import Splash from "tp-lib/splash"
import State from "./state"
import Theme from "tp-lib/theme"
import ToursService from "./service/tours"
import "./index.css"

async function start() {
    Theme.apply("dark")
    const divLogin: HTMLElement | null = document.getElementById("login")
    const user = await LoginService.getCurrentUser({
        requiredGrants: ["user"],
        container: divLogin,
    })
    console.info("user=", user)
    if (!user) {
        await LoginService.logout(true)
        return
    }
    const tours = await ToursService.list()
    const [tour] = tours
    console.log("🚀 [index] tours = ", tours) // @FIXME: Remove this line written on 2022-03-25 at 17:15
    State.update({
        tours: tours,
        applicationId: tour.id,
        applicationPackage: await ToursService.getApplicationPackage(
            tour.id,
            State.select((s) => s.versionType)
        ),
    })
    ReactDOM.render(<App />, document.getElementById("root"))
    Splash.hide(500)
}

start()
