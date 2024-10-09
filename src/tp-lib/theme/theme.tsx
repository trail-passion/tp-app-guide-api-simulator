import "./theme.css"
import "../fonts/josefin/josefin.css"

import Color from "../ui/color"
import Theme from "../ui/theme"

export default { apply }

function apply(name: "light" | "dark") {
    if (name === "light") {
        Theme.apply({
            colors: {
                error: "#F87",
                screen: "#BBB",
                frame: "#CCC",
                section: "#DDD",
                input: "#FFF",
                primary: grad("#46e200"),
                accent: grad("#FFA000"),
                white: "#fffe",
                black: "#000e",
            },
        })
    } else {
        Theme.apply({
            colors: {
                error: "#F87",
                screen: "#332b24",
                frame: "#55443b",
                section: "#554d44",
                input: "#ddccbc",
                primary: grad("#5bcc29"),
                accent: grad("#FFA000"),
                white: "#fffe",
                black: "#000e",
            },
        })
    }
}

function grad(colorCode: string): {
    base: string
    dark: string
    light: string
} {
    const color = new Color(colorCode)
    color.rgb2hsl()
    color.L = 0.5
    color.hsl2rgb()
    const base = color.stringify()
    color.L = 0.75
    color.hsl2rgb()
    const light = color.stringify()
    color.L = 0.25
    color.hsl2rgb()
    const dark = color.stringify()
    return { base, light, dark }
}
