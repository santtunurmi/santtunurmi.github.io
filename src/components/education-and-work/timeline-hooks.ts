import { useEffect, useLayoutEffect, useState, type RefObject } from 'react'
import { mapsMatch, resolveTimelineDateLabelSides, resolveTimelineTitleLayout } from './timeline-layout'
import type { TimelineDateSide, TimelineEntry, TimelineScale } from './timeline-types'

type TimelineTitleLayout = {
    offsets: ReadonlyMap<string, number>
    heights: ReadonlyMap<string, number>
    widths: ReadonlyMap<string, number>
    connectorYs: ReadonlyMap<string, number>
    dateLabelSides: ReadonlyMap<string, TimelineDateSide>
}

export function useTimelineTitleOffsets(timelineRef: RefObject<HTMLElement | null>, entries: readonly TimelineEntry[], scale: TimelineScale, timelineHeight: number, timelineWidth: number, endpointPositions: ReadonlyMap<string, number>, defaultDateLabelSides: ReadonlyMap<string, TimelineDateSide>): TimelineTitleLayout {
    const [titleOffsets, setTitleOffsets] = useState<ReadonlyMap<string, number>>(new Map())
    const [titleHeights, setTitleHeights] = useState<ReadonlyMap<string, number>>(new Map())
    const [titleWidths, setTitleWidths] = useState<ReadonlyMap<string, number>>(new Map())
    const [connectorYs, setConnectorYs] = useState<ReadonlyMap<string, number>>(new Map())
    const [dateLabelSides, setDateLabelSides] = useState<ReadonlyMap<string, TimelineDateSide>>(defaultDateLabelSides)

    useLayoutEffect(() => {
        const timeline = timelineRef.current

        if (!timeline) {
            return
        }

        const titleElements = [...timeline.querySelectorAll<HTMLElement>('[data-timeline-entry-id]')]
        const dateLabelElements = [...timeline.querySelectorAll<HTMLElement>('[data-timeline-date-id]')]

        function updateTitleOffsets() {
            const nextTitleHeights = new Map(titleElements.map((element) => [element.dataset.timelineEntryId ?? '', element.getBoundingClientRect().height]))
            const nextTitleWidths = new Map(titleElements.map((element) => [element.dataset.timelineEntryId ?? '', element.getBoundingClientRect().width]))
            const nextTitleLayout = resolveTimelineTitleLayout(entries, scale, timelineHeight, nextTitleHeights, nextTitleWidths, endpointPositions, timelineWidth)
            const nextLabelSizes = new Map(dateLabelElements.map((element) => [element.dataset.timelineDateId ?? '', {
                width: element.getBoundingClientRect().width,
                height: element.getBoundingClientRect().height,
            }]))
            const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
            const nextDateLabelSides = resolveTimelineDateLabelSides(entries, defaultDateLabelSides, endpointPositions, nextTitleLayout.offsets, nextTitleLayout.connectorYs, nextTitleHeights, nextTitleWidths, nextLabelSizes, timelineWidth, rootFontSize * 0.85)

            setTitleOffsets((currentTitleOffsets) => mapsMatch(currentTitleOffsets, nextTitleLayout.offsets) ? currentTitleOffsets : nextTitleLayout.offsets)
            setTitleHeights((currentTitleHeights) => mapsMatch(currentTitleHeights, nextTitleHeights) ? currentTitleHeights : nextTitleHeights)
            setTitleWidths((currentTitleWidths) => mapsMatch(currentTitleWidths, nextTitleWidths) ? currentTitleWidths : nextTitleWidths)
            setConnectorYs((currentConnectorYs) => mapsMatch(currentConnectorYs, nextTitleLayout.connectorYs) ? currentConnectorYs : nextTitleLayout.connectorYs)
            setDateLabelSides((currentDateLabelSides) => mapsMatch(currentDateLabelSides, nextDateLabelSides) ? currentDateLabelSides : nextDateLabelSides)
        }

        updateTitleOffsets()

        const resizeObserver = new ResizeObserver(updateTitleOffsets)
        titleElements.forEach((element) => resizeObserver.observe(element))
        dateLabelElements.forEach((element) => resizeObserver.observe(element))

        return () => resizeObserver.disconnect()
    }, [defaultDateLabelSides, endpointPositions, entries, scale, timelineHeight, timelineRef, timelineWidth])

    return { offsets: titleOffsets, heights: titleHeights, widths: titleWidths, connectorYs, dateLabelSides }
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
