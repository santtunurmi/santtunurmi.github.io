import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent, type RefObject } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { useDialogTransition } from './motion'

type TimelineMonth = {
    year: number
    month: number
}

type TimelineGeometry =
    | {
          type: 'duration'
          start: TimelineMonth
          end: TimelineMonth | 'current'
          lane?: number
          titleSide?: 'left' | 'right'
          titleOffset?: number
      }
    | {
          type: 'point'
          at: TimelineMonth
          lane?: number
          titleSide?: 'left' | 'right'
          titleOffset?: number
      }

export type TimelineEntry = {
    id: string
    title: string
    organization: string
    location: string
    period: string
    description?: string
    geometry: TimelineGeometry
}

export type TimelineScale = {
    baseline: TimelineMonth
    current: TimelineMonth
    months: number
}

const TIMELINE_BASELINE: TimelineMonth = { year: 2018, month: 1 }

const durationLineDuration = 0.72
const endpointRevealDuration = 0.3
const connectorDuration = 0.46
const titleRevealDuration = 0.22
const timelinePixelsPerMonth = 18
const nearbyDateRangeMonths = 2
const timelineAxisRatio = 0.44
const timelineTitleLeftEdgeRatio = 0.35
const timelineTitleRightEdgeRatio = 0.65
const timelineLaneOffset = 20
const timelineConnectorOverlap = 12
const timelineDotRadius = 5.4
const timelineDotHitRadius = 11
const timelineTitleGap = 8

export function createTimelineScale(now = new Date()): TimelineScale {
    const current = { year: now.getFullYear(), month: now.getMonth() + 1 }

    return {
        baseline: TIMELINE_BASELINE,
        current,
        months: monthIndex(current, TIMELINE_BASELINE) + 1,
    }
}

const educationTimeline: readonly TimelineEntry[] = [
    {
        id: 'jamk-ict-2022',
        title: "Bachelor's Degree Programme in Information and Communication Technology",
        organization: 'JAMK University of Applied Sciences',
        location: 'Jyväskylä',
        period: 'August 2022 – thesis planned for autumn 2026',
        geometry: {
            type: 'duration',
            start: { year: 2022, month: 8 },
            end: 'current',
        },
    },
    {
        id: 'aanekoski-upper-secondary-2019',
        title: 'High School Diploma',
        organization: 'Äänekoski Upper Secondary School',
        location: 'Äänekoski',
        period: 'August 2019 – June 2022',
        geometry: {
            type: 'duration',
            start: { year: 2019, month: 8 },
            end: { year: 2022, month: 6 },
        },
    },
]

const workTimeline: readonly TimelineEntry[] = [
    {
        id: 'exen-intern-2026',
        title: 'Software Development Intern',
        organization: 'EXEN esports Oy',
        location: 'Jyväskylä / Hybrid',
        period: 'January – May 2026',
        description: 'Worked accross four different projects, ranging from application work, system restoration, technical audit, cloud-host and CI/CD research, WordPress/PHP and live video production. I really got to use the entire range of my skillset at EXEN, which remains the strongest showcase of my project-first mentality and ability to get things done, as all four projects were a success.',
        geometry: {
            type: 'duration',
            start: { year: 2026, month: 1 },
            end: { year: 2026, month: 5 },
            lane: 2,
            titleSide: 'right',
        },
    },
    {
        id: 'nuke-liiga-production-manager-2025',
        title: 'Production Manager',
        organization: 'NUKE-Liiga',
        location: 'Hybrid',
        period: 'June 2025 – May 2026',
        description: 'I was the production manager at "NUKE-Liiga", a Finnish academy league for Counter-Strike esports, during its first two seasons. As the production manager, I handled the technical execution of the stream, communicated with casters during broadcasts, and created the stream layouts together with graphic designers. I additionally handled the in-game camerawork.',
        geometry: {
            type: 'duration',
            start: { year: 2025, month: 6 },
            end: { year: 2026, month: 5 },
            lane: 1,
            titleSide: 'right',
        },
    },
    {
        id: 'abc-hirvaskangas-retail-2022',
        title: 'Retail Store Worker (summer job)',
        organization: 'ABC Hirvaskangas',
        location: 'Äänekoski',
        period: 'May 2022 – August 2022',
        description: 'I Worked mainly on shelving, storage and dishes.',
        geometry: {
            type: 'duration',
            start: { year: 2022, month: 5 },
            end: { year: 2022, month: 8 },
            lane: 1,
            titleSide: 'right',
        },
    },
    {
        id: 'k-citymarket-trainee-2019',
        title: 'Trainee (summer job)',
        organization: 'K-Citymarket Äänekoski',
        location: 'Äänekoski',
        period: 'July 2019',
        geometry: {
            type: 'point',
            at: { year: 2019, month: 7 },
            titleOffset: -32,
        },
    },
    {
        id: 'aanekoski-youth-counsellor-2019',
        title: "Youth Counsellor's Assistant (summer job)",
        organization: 'City of Äänekoski',
        location: 'Äänekoski',
        period: 'June 2019',
        geometry: {
            type: 'point',
            at: { year: 2019, month: 6 },
            titleOffset: 32,
        },
    },
    {
        id: 'huvikumpu-summer-trainee-2018',
        title: 'Summer Trainee (summer job)',
        organization: 'Pienryhmäkoti Huvikumpu',
        location: 'Äänekoski',
        period: 'June 2018',
        geometry: {
            type: 'point',
            at: { year: 2018, month: 6 },
        },
    },
]

export const bioTimeline: readonly TimelineEntry[] = [...educationTimeline, ...workTimeline]

type BioTimelineProps = {
    entries: readonly TimelineEntry[]
    scale: TimelineScale
}

export default function BioTimeline({ entries, scale }: BioTimelineProps) {
    const dialogTitleId = useId()
    const dialogRef = useRef<HTMLDialogElement>(null)
    const dialogCloseRef = useRef<HTMLButtonElement>(null)
    const timelineRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const [selectedEntry, setSelectedEntry] = useState<TimelineEntry | null>(null)
    const [dialogVisible, setDialogVisible] = useState(false)
    const timelineWidth = useElementWidth(timelineRef)
    const minimumDevicePixelStrokeWidth = useMinimumDevicePixelStrokeWidth()
    const timelineHeight = scale.months * timelinePixelsPerMonth
    const titleOffsets = useTimelineTitleOffsets(timelineRef, entries, scale, timelineHeight, timelineWidth)
    const dialogTransition = useDialogTransition()

    function openEntry(entry: TimelineEntry, trigger: HTMLButtonElement) {
        triggerRef.current = trigger
        setSelectedEntry(entry)
        requestAnimationFrame(() => {
            dialogRef.current?.showModal()
            setDialogVisible(true)
            requestAnimationFrame(() => dialogCloseRef.current?.focus())
        })
    }

    function closeEntry() {
        setDialogVisible(false)
    }

    function finishDialogClose() {
        if (!dialogVisible) {
            dialogRef.current?.close()
        }
    }

    function restoreTriggerFocus() {
        setDialogVisible(false)
        setSelectedEntry(null)
        requestAnimationFrame(() => triggerRef.current?.focus())
    }

    function closeFromBackdrop(event: ReactMouseEvent<HTMLDialogElement>) {
        if (event.target === event.currentTarget) {
            closeEntry()
        }
    }

    const timelineStyle = {
        '--timeline-height': `${timelineHeight}px`,
        '--timeline-axis-left': `${timelineAxisRatio * 100}%`,
        '--timeline-title-left-edge': `${timelineTitleLeftEdgeRatio * 100}%`,
        '--timeline-lane-offset': `${timelineLaneOffset}px`,
        '--timeline-min-stroke-width': `${minimumDevicePixelStrokeWidth}px`,
    } as CSSProperties
    const dateLabelSides = getDateLabelSides(entries)

    return (
        <div className='bio-timeline' style={timelineStyle} ref={timelineRef}>
            <svg className='bio-timeline-axis' viewBox={`0 0 ${timelineWidth || 1} ${timelineHeight}`} preserveAspectRatio='none' aria-hidden='true' focusable='false'>
                <line className='bio-timeline-axis-line' x1={timelineWidth * timelineAxisRatio} x2={timelineWidth * timelineAxisRatio} y1={0} y2={timelineHeight} />
            </svg>
            <span className='bio-timeline-axis-label bio-timeline-axis-label--end'>{formatAxisMonth(scale.baseline)}</span>
            <ol className='bio-timeline-entries'>
                {entries.map((entry) => (
                    <TimelineItem entry={entry} scale={scale} timelineWidth={timelineWidth} timelineHeight={timelineHeight} titleOffset={titleOffsets.get(entry.id) ?? entry.geometry.titleOffset ?? 0} dateLabelSides={dateLabelSides} onOpen={openEntry} key={entry.id} />
                ))}
            </ol>
            <dialog className={`bio-timeline-dialog${dialogVisible ? ' bio-timeline-dialog--visible' : ''}`} ref={dialogRef} onClick={closeFromBackdrop} onCancel={(event) => { event.preventDefault(); closeEntry() }} onClose={restoreTriggerFocus} aria-labelledby={dialogTitleId}>
                <AnimatePresence onExitComplete={finishDialogClose}>
                    {selectedEntry && dialogVisible && (
                        <motion.div className='bio-timeline-dialog-content' {...dialogTransition}>
                            <button className='bio-timeline-dialog-close' ref={dialogCloseRef} type='button' onClick={closeEntry} aria-label='Close'>Close</button>
                            <h3 id={dialogTitleId} className='h4 fw-semibold'>{selectedEntry.title}</h3>
                            <p className='mb-1'>{selectedEntry.organization} · {selectedEntry.location}</p>
                            <p className='bio-timeline-date mb-0'>{selectedEntry.period}</p>
                            {selectedEntry.description && <p className='mb-0 mt-3'>{selectedEntry.description}</p>}
                        </motion.div>
                    )}
                </AnimatePresence>
            </dialog>
        </div>
    )
}

type TimelineItemProps = {
    entry: TimelineEntry
    scale: TimelineScale
    timelineWidth: number
    timelineHeight: number
    titleOffset: number
    dateLabelSides: ReadonlyMap<string, 'left' | 'right'>
    onOpen: (entry: TimelineEntry, trigger: HTMLButtonElement) => void
}

function TimelineItem({ entry, scale, timelineWidth, timelineHeight, titleOffset, dateLabelSides, onOpen }: TimelineItemProps) {
    const viewportAnchorRef = useRef<HTMLSpanElement>(null)
    const entryInView = useInView(viewportAnchorRef, { once: true, margin: '0px 0px 5% 0px' })
    const reducedMotion = useReducedMotion()
    const geometry = entry.geometry
    const isDuration = geometry.type === 'duration'
    const isOngoing = geometry.type === 'duration' && geometry.end === 'current'
    const startMonth = geometry.type === 'duration' ? geometry.start : geometry.at
    const endMonth = geometry.type === 'duration'
        ? geometry.end === 'current'
            ? scale.current
            : geometry.end
        : geometry.at
    const start = monthPosition(startMonth, scale)
    const end = monthPosition(endMonth, scale)
    const anchor = isDuration ? (start + end) / 2 : start
    const titleSide = geometry.titleSide ?? 'left'
    const lane = geometry.lane ?? 0
    const isOffsetLane = lane > 0
    const artworkWidth = timelineWidth || 1
    const laneX = timelineWidth * timelineAxisRatio + lane * timelineLaneOffset
    const startY = timelineHeight * start / 100
    const endY = timelineHeight * end / 100
    const anchorY = timelineHeight * anchor / 100
    const titleEdgeX = timelineWidth * (titleSide === 'right' ? timelineTitleRightEdgeRatio : timelineTitleLeftEdgeRatio)
    const titleOverlapX = titleEdgeX + (titleSide === 'right' ? timelineConnectorOverlap : -timelineConnectorOverlap)
    const connectorPath = `M ${laneX} ${anchorY} H ${titleEdgeX}${titleOffset !== 0 ? ` V ${anchorY + titleOffset}` : ''} H ${titleOverlapX}`
    const startDateLabel = geometry.type === 'duration' ? `${entry.id}:start` : `${entry.id}:point`
    const endDateLabel = `${entry.id}:end`
    const startDateSide = dateLabelSides.get(startDateLabel)
    const endDateSide = dateLabelSides.get(endDateLabel)
    const showStartDate = startDateSide !== undefined
    const showEndDate = isOngoing || endDateSide !== undefined
    const itemStyle = {
        '--entry-start': `${start}%`,
        '--entry-end': `${end}%`,
        '--entry-anchor': `${anchor}%`,
        '--entry-lane': geometry.lane ?? 0,
        '--entry-title-offset': `${titleOffset}px`,
    } as CSSProperties
    const endpointDelay = isDuration ? durationLineDuration : 0
    const connectorDelay = endpointDelay + endpointRevealDuration
    const titleDelay = connectorDelay + connectorDuration
    const immediate = reducedMotion ? { duration: 0 } : undefined

    return (
        <motion.li className={`bio-timeline-entry bio-timeline-entry--title-${titleSide}${isDuration ? ' bio-timeline-entry--duration' : ' bio-timeline-entry--point'}${titleOffset > 0 ? ' bio-timeline-entry--title-down' : ''}${titleOffset < 0 ? ' bio-timeline-entry--title-up' : ''}`} style={itemStyle} initial='hidden' animate={reducedMotion || entryInView ? 'visible' : 'hidden'}>
            <span ref={viewportAnchorRef} className='bio-timeline-viewport-anchor' aria-hidden='true'></span>
            <svg className='bio-timeline-entry-artwork' viewBox={`0 0 ${artworkWidth} ${timelineHeight}`} preserveAspectRatio='none' aria-hidden='true' focusable='false'>
                {isDuration && (
                    <>
                        <motion.line className='bio-timeline-segment' x1={laneX} x2={laneX} y1={anchorY} y2={startY} variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }} transition={{ duration: reducedMotion ? 0 : durationLineDuration, ease: 'easeInOut' }} />
                        <motion.line className='bio-timeline-segment' x1={laneX} x2={laneX} y1={anchorY} y2={endY} variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }} transition={{ duration: reducedMotion ? 0 : durationLineDuration, ease: 'easeInOut' }} />
                    </>
                )}
                <motion.path className='bio-timeline-connector' d={connectorPath} variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }} transition={{ duration: reducedMotion ? 0 : connectorDuration, delay: reducedMotion ? 0 : connectorDelay }} />
                <motion.circle className='bio-timeline-dot' cx={laneX} cy={startY} r={timelineDotRadius} variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }} transition={{ duration: reducedMotion ? 0 : endpointRevealDuration, delay: reducedMotion ? 0 : endpointDelay }} />
                {isDuration && !isOngoing && <motion.circle className='bio-timeline-dot' cx={laneX} cy={endY} r={timelineDotRadius} variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }} transition={{ duration: reducedMotion ? 0 : endpointRevealDuration, delay: reducedMotion ? 0 : endpointDelay }} />}
                {isDuration && (
                    <>
                        <line className='bio-timeline-entry-hit-line' x1={laneX} x2={laneX} y1={anchorY} y2={startY} />
                        <line className='bio-timeline-entry-hit-line' x1={laneX} x2={laneX} y1={anchorY} y2={endY} />
                    </>
                )}
                <path className='bio-timeline-entry-hit-line' d={connectorPath} />
                <circle className='bio-timeline-entry-hit-dot' cx={laneX} cy={startY} r={timelineDotHitRadius} />
                {isDuration && !isOngoing && <circle className='bio-timeline-entry-hit-dot' cx={laneX} cy={endY} r={timelineDotHitRadius} />}
            </svg>
            {showStartDate && <motion.span className={`bio-timeline-entry-date bio-timeline-entry-date--start bio-timeline-entry-date--${startDateSide}${isOffsetLane ? ' bio-timeline-entry-date--offset-lane' : ''}`} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} transition={{ duration: reducedMotion ? 0 : endpointRevealDuration, delay: reducedMotion ? 0 : endpointDelay }}>{formatAxisMonth(startMonth)}</motion.span>}
            {isDuration && showEndDate && <motion.span className={`bio-timeline-entry-date bio-timeline-entry-date--end bio-timeline-entry-date--${endDateSide ?? (isOffsetLane ? 'right' : 'left')}${isOffsetLane ? ' bio-timeline-entry-date--offset-lane' : ''}`} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} transition={{ duration: reducedMotion ? 0 : endpointRevealDuration, delay: reducedMotion ? 0 : endpointDelay }}>{isOngoing ? 'Ongoing' : formatAxisMonth(endMonth)}</motion.span>}
            <motion.button className='bio-timeline-title' type='button' data-timeline-entry-id={entry.id} onClick={(event) => onOpen(entry, event.currentTarget)} variants={{ hidden: { opacity: 0, x: titleSide === 'right' ? -4 : 4 }, visible: { opacity: 1, x: 0 } }} transition={immediate ?? { duration: titleRevealDuration, delay: titleDelay }}>
                <span className='bio-timeline-title-name'>{entry.title}</span>
                <span className='bio-timeline-title-organization'>{entry.organization}</span>
            </motion.button>
        </motion.li>
    )
}

function getDateLabelSides(entries: readonly TimelineEntry[]): ReadonlyMap<string, 'left' | 'right'> {
    const labelsByMonth = new Map<string, { id: string; lane: number; month: TimelineMonth; side: 'left' | 'right'; titleSide: 'left' | 'right' }>()

    for (const entry of entries) {
        const geometry = entry.geometry
        const lane = geometry.lane ?? 0
        const side = geometry.type === 'point' || lane > 0 ? 'right' : 'left'
        const titleSide = geometry.titleSide ?? 'left'
        const labels = geometry.type === 'duration'
            ? [
                  { id: `${entry.id}:start`, month: geometry.start },
                  ...(geometry.end === 'current' ? [] : [{ id: `${entry.id}:end`, month: geometry.end }]),
              ]
            : [{ id: `${entry.id}:point`, month: geometry.at }]

        for (const label of labels) {
            const month = `${label.month.year}-${label.month.month}`
            const current = labelsByMonth.get(month)

            if (!current || lane > current.lane) {
                labelsByMonth.set(month, { id: label.id, lane, month: label.month, side, titleSide })
            }
        }
    }

    const labels = [...labelsByMonth.values()]

    return new Map(labels.map((label) => {
        const labelMonth = monthIndex(label.month, TIMELINE_BASELINE)
        const nearbyLabels = labels.filter((candidate) => (
            candidate.id !== label.id
            && Math.abs(monthIndex(candidate.month, TIMELINE_BASELINE) - labelMonth) <= nearbyDateRangeMonths
        ))
        const nearbyClusterUsesRightTitles = nearbyLabels.some((candidate) => candidate.titleSide === 'right')
        const moveMainDateRight = label.side === 'left' && nearbyLabels.length > 0 && !nearbyClusterUsesRightTitles

        return [label.id, moveMainDateRight ? 'right' : label.side]
    }))
}

function useTimelineTitleOffsets(timelineRef: RefObject<HTMLElement | null>, entries: readonly TimelineEntry[], scale: TimelineScale, timelineHeight: number, timelineWidth: number): ReadonlyMap<string, number> {
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

function resolveTimelineTitleOffsets(entries: readonly TimelineEntry[], scale: TimelineScale, timelineHeight: number, titleHeights: ReadonlyMap<string, number>): ReadonlyMap<string, number> {
    const titlePositions = entries.map((entry) => {
        const anchor = getEntryAnchor(entry, scale) * timelineHeight / 100
        const desiredOffset = entry.geometry.titleOffset ?? 0

        return {
            id: entry.id,
            side: entry.geometry.titleSide ?? 'left',
            height: titleHeights.get(entry.id) ?? 0,
            anchor,
            center: anchor + desiredOffset,
        }
    })

    for (const side of ['left', 'right'] as const) {
        const sidePositions = titlePositions
            .filter((position) => position.side === side && position.height > 0)
            .sort((first, second) => first.center - second.center)

        for (let pass = 0; pass < sidePositions.length; pass += 1) {
            let foundCollision = false

            for (let index = 0; index < sidePositions.length - 1; index += 1) {
                const upper = sidePositions[index]
                const lower = sidePositions[index + 1]
                const requiredDistance = (upper.height + lower.height) / 2 + timelineTitleGap
                const overlap = requiredDistance - (lower.center - upper.center)

                if (overlap > 0) {
                    upper.center -= overlap / 2
                    lower.center += overlap / 2
                    foundCollision = true
                }
            }

            if (!foundCollision) {
                break
            }
        }
    }

    return new Map(titlePositions.map((position) => [position.id, Math.round((position.center - position.anchor) * 100) / 100]))
}

function getEntryAnchor(entry: TimelineEntry, scale: TimelineScale): number {
    const geometry = entry.geometry
    const startMonth = geometry.type === 'duration' ? geometry.start : geometry.at
    const endMonth = geometry.type === 'duration'
        ? geometry.end === 'current'
            ? scale.current
            : geometry.end
        : geometry.at
    const start = monthPosition(startMonth, scale)
    const end = monthPosition(endMonth, scale)

    return geometry.type === 'duration' ? (start + end) / 2 : start
}

function mapsMatch(first: ReadonlyMap<string, number>, second: ReadonlyMap<string, number>): boolean {
    return first.size === second.size && [...first].every(([key, value]) => second.get(key) === value)
}

function useMinimumDevicePixelStrokeWidth(): number {
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
            resolutionQuery.removeEventListener('change', updateStrokeWidth)
            window.removeEventListener('resize', updateStrokeWidth)
            window.visualViewport?.removeEventListener('resize', updateStrokeWidth)
        }
    }, [])

    return strokeWidth
}

function useElementWidth(elementRef: RefObject<HTMLElement | null>): number {
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

function monthIndex(month: TimelineMonth, baseline: TimelineMonth): number {
    return (month.year - baseline.year) * 12 + month.month - baseline.month
}

function monthPosition(month: TimelineMonth, scale: TimelineScale): number {
    return 100 - (monthIndex(month, scale.baseline) / (scale.months - 1)) * 100
}

function formatAxisMonth(month: TimelineMonth): string {
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(month.year, month.month - 1, 1))
}
