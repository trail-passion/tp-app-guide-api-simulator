import Service from "tp-lib/service/service"

export async function ApiShowInBrowser(
    url: string,
): Promise<void> {
    window.open(url, "GUIDE")
}
