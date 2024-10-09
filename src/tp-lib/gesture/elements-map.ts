export default class ElementsMap<KeyType, ValueType> {
    private readonly maps =new Map<SVGElement|HTMLElement, Map<KeyType, ValueType>>()

    get(element: SVGElement|HTMLElement, key: KeyType): ValueType | undefined {
        const map = this.maps.get(element)
        if (!map) return undefined

        return map.get(key)
    }

    set(element: SVGElement|HTMLElement, key: KeyType, value: ValueType) {
        let map = this.maps.get(element)
        if (!map) {
            map = new Map<KeyType, ValueType>()
            this.maps.set(element, map)
        }
        map.set(key, value)
    }

    delete(element: SVGElement|HTMLElement, key: KeyType) {
        const map = this.maps.get(element)
        if (!map) return

        map.delete(key)
        if(map.size === 0) {
            this.maps.delete(element)
        }
    }
}