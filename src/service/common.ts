export function throwIfNeeded(result: any) {
    if (typeof result !== 'number') return;
    if (result >= 0) return;
    switch (result) {
        case -1: throw Error("Missing `cmd` attribute!");
        case -2: throw Error("Unknown command!");
        case -3: throw Error("No logged user!");
        case -4: throw Error("Missing `pack/name` attribute!");
        case -5: throw Error("Missing `pack/theme` attribute!");
        case -6: throw Error("Missing `pack` attribute!");
        case -7: throw Error("Missing `pack/id` attribute!");
        case -8: throw Error("Missing `packId` attribute!");
        case -9: throw Error("This pack does not belong to the current user!");
        case -10: throw Error("Missing `ids` attribute!");
        default: throw Error(`Unknown error #${result}!`);
    }
}
