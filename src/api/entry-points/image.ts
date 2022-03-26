export async function ApiGetImage(url: string): Promise<string> {
    return url
    // return new Promise(resolve => {
    //     const img = new Image()
    //     img.src = url
    //     img.onload = ()=>resolve(url)
    //     img.onerror= () => {
    //         console.error("Unable to load this image:", url)
    //     }
    // })
}