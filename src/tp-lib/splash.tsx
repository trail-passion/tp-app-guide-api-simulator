import Markdown from "markdown-to-jsx"
import * as React from "react"
import "./splash.css"
import { TranslateLib as Translate } from "tp-lib/translate"
import Modal from "./ui/modal"

// Vanishing animation duration.
const DEFAULT_DURATION = 500
// The minimum number of millisecond the splash screen must be visible.
const MIN_DISPLAY_TIME = 1000

export default { hide, hideAfter }

/**
 * Remove the logo after a fading of `duration` milliseconds.
 *
 * @param duration - Fading time in milliseconds.
 */
function hide(duration: number = DEFAULT_DURATION) {
    const logo = document.getElementById("tp-logo")
    if (!logo) return
    const parent = logo.parentNode
    if (!parent) return
    logo.style.transition = `opacity ${duration}ms`
    setTimeout(() => {
        logo.classList.add("hide")
        setTimeout(() => {
            try {
                parent.removeChild(logo)
            } catch (ex) {
                /* Exception ignored */
            }
        }, duration)
    })
    displayRGPD()
}

/**
 * Wait for an action to be finished before removing the splash screen.
 * The splash screen will last at least MIN_DISPLAY_TIME milliseconds
 * before starting to vanish, even if the action is already done.
 */
async function hideAfter(action: Promise<any>) {
    // We want the splash screen to be visible at least 1000 msec.
    const time = Date.now()
    const result = await action
    hide(Math.max(0, MIN_DISPLAY_TIME - Date.now() + time))
    return result
}

const RGPD_VERSION = 1

/**
 * We must display a RGPD disclaimer when the splash screen fades.
 * It will be shown only once, unless you change your language.
 */
function displayRGPD() {
    const key = `${RGPD_VERSION}/${Translate.$lang}`
    if (window.localStorage.getItem("rgpd") === key) return

    Modal.info({
        content: (
            <div style={{ maxWidth: "400px" }}>
                <Markdown>{Translate.rgpd}</Markdown>
            </div>
        ),
        align: "",
        padding: "1rem",
    }).then(() => window.localStorage.setItem("rgpd", key))
}
