import { useEffect, useLayoutEffect, useState, type RefObject } from 'react'
import { mapsMatch, resolveTimelineTitleOffsets } from './timeline-layout'
import type { TimelineEntry, TimelineScale } from './timeline-types'

export function useTimelineTitleOffsets(timelineRef: RefObject<HTMLElement | null>, entries: readonly TimelineEntry[], scale: TimelineScale, timelineHeight: number, timelineWidth: number): ReadonlyMap<string, number> {
    const [titleOffsets, setTitleOffsets] = useState<ReadonlyMap<string, number>>(new Map())

    useLayoutEffect(() => {
        const timeline = timelineRef.current

        if (!timeline) {
            return
        }

        const titleElements = [...timeline.querySelectorAll<HTMLElement>('[data-timeline-entry-id]')]

        function updateTitleOffsets() {
            const titleHeights = new Map(titleElements.map((element) => [element.dataset.timelineEntryId ?? '', element.getBoundingClientRect().height]))
            const nextTitleOffsets = resolveTimelineTitleOffsets(entries, scale, timelineHeight, titleHeights)

            setTitleOffsets((currentTitleOffsets) => mapsMatch(currentTitleOffsets, nextTitleOffsets) ? currentTitleOffsets : nextTitleOffsets)
        }

        updateTitleOffsets()

        const resizeObserver = new ResizeObserver(updateTitleOffsets)
        titleElements.forEach((element) => resizeObserver.observe(element))

        return () => resizeObserver.disconnect()
    }, [entries, scale, timelineHeight, timelineRef, timelineWidth])

    return titleOffsets
}

export function useMinimumDevicePixelStrokeWidth(): number {
    const [strokeWidth, setStrokeWidth] = useState(() => 1 / window.devicePixelRatio)

    useEffect(() => {
        let resolutionQuery: MediaQueryList

        function updateStrokeWidth() {
            setStrokeWidth(1 / window.devicePixelRatio)
            resolutionQuery?.removeEventListener('change', updateStrokeWidth)
            resolutionQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
            resolutionQuery.addEventListener('change', updateStrokeWidth)
        }

        updateStrokeWidth()
        window.addEventListener('resize', updateStrokeWidth)
        window.visualViewport?.addEventListener('resize', updateStrokeWidth)

        return () => {
            resolutionQuery?.removeEventListener('change', updateStrokeWidth)
            window.removeEventListener('resize', updateStrokeWidth)
            window.visualViewport?.removeEventListener('resize', updateStrokeWidth)
        }
    }, [])

    return strokeWidth
}

export function useElementWidth(elementRef: RefObject<HTMLElement | null>): number {
    const [width, setWidth] = useState(0)

    useLayoutEffect(() => {
        const element = elementRef.current

        if (!element) {
            return
        }

        setWidth(element.getBoundingClientRect().width)

        const resizeObserver = new ResizeObserver(([entry]) => {
            setWidth(entry.contentRect.width)
        })

        resizeObserver.observe(element)

        return () => resizeObserver.disconnect()
    }, [elementRef])

    return width
}
