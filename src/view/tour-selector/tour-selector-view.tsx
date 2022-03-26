import * as React from "react"
import Button from "tp-lib/ui/view/button"
import Options from "tp-lib/ui/view/options"
import Runnable from "tp-lib/ui/view/runnable"
import SimpleCombo from "tp-lib/ui/view/simple-combo"
import State from "@/state"
import ToursService from "@/service/tours"
import { ITour } from "../../types"
import { useAppState } from "../../state/state"
import "./tour-selector-view.css"

export interface TourSelectorViewProps {
    className?: string
}

export default function TourSelectorView(props: TourSelectorViewProps) {
    const tours = useAppState((s) => s.tours)
    const version = useAppState((s) => s.versionType)
    const [tourId, setTourId] = React.useState(tours[0].id)
    const [busy, setBusy] = React.useState(false)
    const handleLoad = async () => {
        setBusy(true)
        try {
            const applicationPackage = await ToursService.getApplicationPackage(
                tourId,
                version
            )
            State.update({ applicationPackage })
        } catch (ex) {
            console.error("Unable to get application!", ex)
        } finally {
            setBusy(false)
        }
    }
    return (
        <Runnable className={getClassNames(props)} running={busy}>
            <SimpleCombo
                value={`#${tourId}`}
                options={makeOptionsFromTours(tours)}
                onChange={(value) => setTourId(parseInt(value.substring(1)))}
            />
            <Options
                options={{ test: "Test", prod: "Prod" }}
                value={version}
                onClick={(value) => State.update({ versionType: value })}
            />
            <Button label="Load" onClick={handleLoad} />
        </Runnable>
    )
}

function getClassNames(props: TourSelectorViewProps): string {
    const classNames = ["custom", "view-TourSelectorView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function makeOptionsFromTours(tours: ITour[]): { [key: string]: string } {
    const options: { [key: string]: string } = {}
    for (const tour of tours) {
        options[`#${tour.id}`] = tour.name
    }
    return options
}
