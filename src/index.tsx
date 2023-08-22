import * as React from "react"
import App from "./view/app"
import LoginService from "tp-lib/service/login"
import Modal from "tp-lib/ui/modal"
import Splash from "tp-lib/splash"
import State from "./state"
import Theme from "tp-lib/theme"
import ToursService from "./service/tours"
import { createRoot } from "react-dom/client"
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
    if (!tours || tours.length === 0) {
        await Modal.error(
            <div>
                User <b>{user.nickname}</b> owns no Tour!
            </div>
        )
        await LoginService.logout(true)
        return
    }
    const [tour] = tours
    State.update({
        tours: tours,
        applicationId: tour.id,
        applicationPackage: await ToursService.getApplicationPackage(
            tour.id,
            State.select((s) => s.versionType)
        ),
    })
    const root = document.getElementById("root")
    if (!root) throw Error('Can\'t find any element with id "root"!')

    createRoot(root).render(<App />)
    Splash.hide(500)
}

start()
