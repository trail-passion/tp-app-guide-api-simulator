import * as React from "react"
import Dialog from "../../dialog"
import Flex from "../../flex"
import ImportIcon from "../../icons/import"
import InputFile from "../file"
import Label from "../../label"
import Modal from "../../../modal"
import Preview from "./preview"

import "./input-image.css"

interface IInputImageProps {
    label?: string
    labelUpload?: string
    value?: string
    width: number
    height: number
    scale?: number
    quality?: number
    onChange?(url: string): void
    children?: React.ReactNode
}

interface IInputImageState {
    size: "cover" | "contain" | "fill"
}

export default function InputImage(props: IInputImageProps) {
    const [url, setUrl] = React.useState(props.value ?? "")
    const refCanvas = React.useRef<HTMLCanvasElement | null>(null)
    const label = (props.label ?? "").trim()
    const width = props.width ?? 0
    const height = props.height ?? 0
    const quality = props.quality ?? 0.85
    const labelUpload = props.labelUpload ?? "Upload file"
    React.useEffect(() => {
        if (props.value) setUrl(props.value)
    }, [props.value])
    useCanvasPainter(refCanvas, width, height, url)
    const handleUpload = makeUploadHandler(
        width,
        height,
        quality,
        (url: string) => {
            setUrl(url)
            if (props.onChange) {
                props.onChange(url)
            }
        }
    )
    return (
        <div>
            {label && <Label value={label} />}
            <div
                className="image ui-view-InputImage theme-shadow-button theme-color-section"
                style={{
                    maxWidth: `${width}px`,
                    height: 0,
                    paddingBottom: `${(100 * height) / width}%`,
                }}
                title={props.value}
            >
                <canvas ref={refCanvas} width={width} height={height}></canvas>
            </div>
            <Flex justifyContent="space-around" alignItems="center">
                <InputFile
                    onClick={handleUpload}
                    accept="image/*"
                    label={labelUpload}
                    icon={ImportIcon}
                    wide={true}
                    flat={false}
                />
                <>{props.children}</>
            </Flex>
        </div>
    )
}

function useCanvasPainter(
    refCanvas: React.MutableRefObject<HTMLCanvasElement | null>,
    width: number,
    height: number,
    url: string
) {
    React.useEffect(() => {
        const canvas = refCanvas.current
        if (!canvas) return

        const asyncAction = async () => {
            canvas.classList.remove("show")
            const img = await loadImage(url)
            if (img) {
                const ctx = canvas.getContext("2d")
                if (ctx) {
                    ctx.clearRect(0, 0, width, height)
                    ctx.drawImage(img, 0, 0, width, height)
                }
            }
            canvas.classList.add("show")
        }
        void asyncAction()
    }, [refCanvas.current, width, height, url])
}

async function loadImage(url: string): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = "Anonymous"
        img.onload = () => {
            resolve(img)
        }
        img.onerror = () => {
            console.error("Unable to load image:", url)
            resolve(null)
        }
        img.src = url
    })
}

function makeUploadHandler(
    width: number,
    height: number,
    quality: number,
    setUrl: (url: string) => void
) {
    return (files: FileList) => {
        const convertImage = async (url: string) => {
            const img = await loadImage(url)
            if (!img) {
                console.error("Unable to load image:", url)
                return
            }

            const canvas = document.createElement("canvas")
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext("2d")
            if (!ctx) {
                console.error("Unable to get a 2d context!")
                return
            }

            ctx.drawImage(img, 0, 0)
            setUrl(canvas.toDataURL("image/jpeg", quality))
        }
        const file = files[0]
        const reader = new FileReader()
        reader.addEventListener("load", async () => {
            let url = reader.result
            if (typeof url !== "string") return

            const img = await Modal.wait("Loading...", loadImage(url))
            if (!img) return

            if (Math.abs(width / height - img.width / img.height) < 1e-6) {
                // No need for image adjustement.
                convertImage(url)
                return
            }

            const dialog = Modal.show({
                content: (
                    <Dialog
                        title="Adjust Image"
                        onCancel={() => dialog.hide()}
                        onOK={async () => {
                            dialog.hide()
                            if (typeof url === "string") convertImage(url)
                        }}
                    >
                        <Preview
                            width={width ?? 0}
                            height={height ?? 0}
                            mode="cover"
                            url={url ?? ""}
                            onChange={(newURL: string) => {
                                url = newURL
                            }}
                        />
                    </Dialog>
                ),
                autoClosable: true,
            })
        })
        reader.readAsDataURL(file)
    }
}
