import { useRef, type CSSProperties } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import {
    connectorDuration,
    durationLineDuration,
    endpointRevealDuration,
    formatAxisMonth,
    getTimelineConnectorPath,
    monthPosition,
    timelineAxisRatio,
    timelineDotHitRadius,
    timelineDotRadius,
    timelineLaneOffset,
    timelineTitleLeftEdgeRatio,
    timelineTitleRightEdgeRatio,
    titleRevealDuration,
} from './timeline-layout'
import type { TimelineDateSide, TimelineEntry, TimelineScale } from './timeline-types'

type TimelineItemProps = {
    entry: TimelineEntry
    scale: TimelineScale
    timelineWidth: number
    timelineHeight: number
    titleOffset: number
    titleHeight: number
    titleWidth: number
    connectorY?: number
    endpointPositions: ReadonlyMap<string, number>
    dateLabelSides: ReadonlyMap<string, TimelineDateSide>
    active: boolean
    onOpen: (entry: TimelineEntry, trigger: HTMLButtonElement, keyboardActivated: boolean) => void
}

export default function TimelineItem({ entry, scale, timelineWidth, timelineHeight, titleOffset, titleHeight, titleWidth, connectorY, endpointPositions, dateLabelSides, active, onOpen }: TimelineItemProps) {
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
    const startDateLabel = geometry.type === 'duration' ? `${entry.id}:start` : `${entry.id}:point`
    const endDateLabel = `${entry.id}:end`
    const startY = endpointPositions.get(startDateLabel) ?? timelineHeight * monthPosition(startMonth, scale) / 100
    const endY = endpointPositions.get(endDateLabel) ?? timelineHeight * monthPosition(endMonth, scale) / 100
    const anchorY = isDuration ? (startY + endY) / 2 : startY
    const titleSide = geometry.titleSide ?? 'left'
    const lane = geometry.lane ?? 0
    const isOffsetLane = lane > 0
    const artworkWidth = timelineWidth || 1
    const laneX = timelineWidth * timelineAxisRatio + lane * timelineLaneOffset
    const titleEdgeX = timelineWidth * (titleSide === 'right' ? timelineTitleRightEdgeRatio : timelineTitleLeftEdgeRatio)
    const connectorPath = getTimelineConnectorPath({ laneX, anchorY, connectorY: connectorY ?? anchorY, titleEdgeX, titleSide, titleOffset, titleHeight, titleWidth, timelineWidth })
    const startDateSide = dateLabelSides.get(startDateLabel)
    const endDateSide = dateLabelSides.get(endDateLabel)
    const showStartDate = startDateSide !== undefined
    const showEndDate = endDateSide !== undefined
    const itemStyle = {
        '--entry-start-y': `${startY}px`,
        '--entry-end-y': `${endY}px`,
        '--entry-anchor-y': `${anchorY}px`,
        '--entry-lane': geometry.lane ?? 0,
        '--entry-title-offset': `${titleOffset}px`,
    } as CSSProperties
    const endpointDelay = isDuration ? durationLineDuration : 0
    const connectorDelay = endpointDelay + endpointRevealDuration
    const titleDelay = connectorDelay + connectorDuration
    const immediate = reducedMotion ? { duration: 0 } : undefined

    return (
        <motion.li className={`education-and-work-timeline-entry education-and-work-timeline-entry--title-${titleSide}${active ? ' education-and-work-timeline-entry--active' : ''}`} style={itemStyle} initial='hidden' animate={reducedMotion || entryInView ? 'visible' : 'hidden'}>
            <span ref={viewportAnchorRef} className='education-and-work-timeline-viewport-anchor' aria-hidden='true'></span>
            <svg className='education-and-work-timeline-entry-artwork' viewBox={`0 0 ${artworkWidth} ${timelineHeight}`} preserveAspectRatio='none' aria-hidden='true' focusable='false'>
                {isDuration && (
                    <>
                        <motion.line className='education-and-work-timeline-segment' x1={laneX} x2={laneX} y1={anchorY} y2={startY} variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }} transition={{ duration: reducedMotion ? 0 : durationLineDuration, ease: 'easeInOut' }} />
                        <motion.line className='education-and-work-timeline-segment' x1={laneX} x2={laneX} y1={anchorY} y2={endY} variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }} transition={{ duration: reducedMotion ? 0 : durationLineDuration, ease: 'easeInOut' }} />
                    </>
                )}
                <motion.path className='education-and-work-timeline-connector' d={connectorPath} variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }} transition={{ duration: reducedMotion ? 0 : connectorDuration, delay: reducedMotion ? 0 : connectorDelay }} />
                <motion.circle className='education-and-work-timeline-dot' cx={laneX} cy={startY} r={timelineDotRadius} variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }} transition={{ duration: reducedMotion ? 0 : endpointRevealDuration, delay: reducedMotion ? 0 : endpointDelay }} />
                {isDuration && !isOngoing && <motion.circle className='education-and-work-timeline-dot' cx={laneX} cy={endY} r={timelineDotRadius} variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }} transition={{ duration: reducedMotion ? 0 : endpointRevealDuration, delay: reducedMotion ? 0 : endpointDelay }} />}
                {isDuration && (
                    <>
                        <line className='education-and-work-timeline-entry-hit-line' x1={laneX} x2={laneX} y1={anchorY} y2={startY} />
                        <line className='education-and-work-timeline-entry-hit-line' x1={laneX} x2={laneX} y1={anchorY} y2={endY} />
                    </>
                )}
                <path className='education-and-work-timeline-entry-hit-line' d={connectorPath} />
                <circle className='education-and-work-timeline-entry-hit-dot' cx={laneX} cy={startY} r={timelineDotHitRadius} />
                {isDuration && !isOngoing && <circle className='education-and-work-timeline-entry-hit-dot' cx={laneX} cy={endY} r={timelineDotHitRadius} />}
            </svg>
            {showStartDate && <motion.span className={`education-and-work-timeline-entry-date education-and-work-timeline-entry-date--start education-and-work-timeline-entry-date--${startDateSide}${isOffsetLane ? ' education-and-work-timeline-entry-date--offset-lane' : ''}`} data-timeline-date-id={startDateLabel} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} transition={{ duration: reducedMotion ? 0 : endpointRevealDuration, delay: reducedMotion ? 0 : endpointDelay }}>{formatAxisMonth(startMonth)}</motion.span>}
            {isDuration && showEndDate && <motion.span className={`education-and-work-timeline-entry-date education-and-work-timeline-entry-date--end education-and-work-timeline-entry-date--${endDateSide}${isOffsetLane ? ' education-and-work-timeline-entry-date--offset-lane' : ''}`} data-timeline-date-id={endDateLabel} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} transition={{ duration: reducedMotion ? 0 : endpointRevealDuration, delay: reducedMotion ? 0 : endpointDelay }}>{isOngoing ? 'Ongoing' : formatAxisMonth(endMonth)}</motion.span>}
            <motion.button className='education-and-work-timeline-title' type='button' data-timeline-entry-id={entry.id} onClick={(event) => onOpen(entry, event.currentTarget, event.detail === 0)} variants={{ hidden: { opacity: 0, x: titleSide === 'right' ? -4 : 4 }, visible: { opacity: 1, x: 0 } }} transition={immediate ?? { duration: titleRevealDuration, delay: titleDelay }}>
                <span className='education-and-work-timeline-title-name'>{entry.title}</span>
                <span className='education-and-work-timeline-title-organization'>{entry.organization}</span>
            </motion.button>
        </motion.li>
    )
}
