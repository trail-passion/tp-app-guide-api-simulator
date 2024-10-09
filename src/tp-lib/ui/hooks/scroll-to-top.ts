import * as React from "react"

/**
 * @returns
 * * `canScrollToTop`: true if `ref.current` has scrolled vertically.
 * * `scrollToTop`: function to call to reset vertical scrolling.
 */
export function useScrollToTop(
    ref: React.MutableRefObject<HTMLElement | null>
): [canScrollToTop: boolean, scrollToTop: () => void] {
    const [showScrollToTopButton, setShowScrollToTopButton] =
        React.useState(false)
    React.useEffect(() => {
        const element = ref.current
        if (!element) {
            setShowScrollToTopButton(false)
            return
        }
        const handleScroll = () =>
            setShowScrollToTopButton(element.scrollTop > 0)
        element.addEventListener("scroll", handleScroll)
        return () => element.removeEventListener("scroll", handleScroll)
    }, [ref])
    return [
        showScrollToTopButton,
        () => {
            if (ref.current) {
                ref.current.scrollTo({
                    top: 0,
                    behavior: "smooth",
                })
            }
        },
    ]
}
