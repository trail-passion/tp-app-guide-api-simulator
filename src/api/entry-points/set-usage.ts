import Md5 from "md5"
import Service from "tp-lib/service/service"

export async function ApiSetUsage(traceId: number): Promise<void> {
    const key = "tkJGppFq5UN46Pa28PzRdM2rguLXYabZ"
    const time = getYYYYMMDD()
    const result = await Service.exec("tp.trace.usage.set", {
        phone: "SIMULATOR",
        trace: traceId,
        time,
        hash: Md5(`${key}SIMULATOR${time}${traceId}`),
    })
    console.log("🚀 [set-usage] result = ", result) // @FIXME: Remove this line written on 2022-08-19 at 19:45
}

function getYYYYMMDD() {
    const d = new Date()
    const yy = d.getFullYear()
    const mm = d.getMonth() + 1
    const dd = d.getDate()
    return `${yy}${mm < 10 ? "" : "0"}${mm}${dd < 10 ? "" : "0"}${dd}`
}
