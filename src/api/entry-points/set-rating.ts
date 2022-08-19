import Service from "tp-lib/service/service"

export async function ApiSetRating(
    traceId: number,
    rating: number,
    comment: string
): Promise<void> {
    const result = await Service.exec("tp.rating.set", {
        id: "SIMULATOR",
        trace: traceId,
        value: rating,
        comment,
    })
    console.log("🚀 [set-rating] result = ", result) // @FIXME: Remove this line written on 2022-08-19 at 19:45
}
