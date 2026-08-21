import { useMemo, useRef, useState, type CSSProperties } from 'react'
import ModalDisplay from '../ModalDisplay'
import TimelineItem from './TimelineItem'
import { useElementWidth, useMinimumDevicePixelStrokeWidth, useTimelineTitleOffsets } from './timeline-hooks'
import { getDateLabelSides, resolveTimelineEndpointPositions, timelineAxisRatio, timelineLaneOffset, timelinePixelsPerMonth, timelineTitleLeftEdgeRatio } from './timeline-layout'
import type { TimelineEntry, TimelineScale } from './timeline-types'

type EducationAndWorkTimelineProps = {
    entries: readonly TimelineEntry[]
    scale: TimelineScale
}

export default function EducationAndWorkTimeline({ entries, scale }: EducationAndWorkTimelineProps) {
    const timelineRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const [selectedEntry, setSelectedEntry] = useState<TimelineEntry | null>(null)
    const [activeEntryId, setActiveEntryId] = useState<string | null>(null)
    const [restoreFocus, setRestoreFocus] = useState(false)
    const timelineWidth = useElementWidth(timelineRef)
    const minimumDevicePixelStrokeWidth = useMinimumDevicePixelStrokeWidth()
    const timelineHeight = scale.months * timelinePixelsPerMonth
    const endpointPositions = useMemo(() => resolveTimelineEndpointPositions(entries, scale, timelineHeight), [entries, scale, timelineHeight])
    const defaultDateLabelSides = useMemo(() => getDateLabelSides(entries), [entries])
    const titleLayout = useTimelineTitleOffsets(timelineRef, entries, scale, timelineHeight, timelineWidth, endpointPositions, defaultDateLabelSides)

    function openEntry(entry: TimelineEntry, trigger: HTMLButtonElement, keyboardActivated: boolean) {
        triggerRef.current = trigger
        setRestoreFocus(keyboardActivated)

        if (!keyboardActivated) {
            trigger.blur()
        }

        setSelectedEntry(entry)
        setActiveEntryId(entry.id)
    }

    const timelineStyle = {
        '--timeline-height': `${timelineHeight}px`,
        '--timeline-axis-left': `${timelineAxisRatio * 100}%`,
        '--timeline-title-left-edge': `${timelineTitleLeftEdgeRatio * 100}%`,
        '--timeline-lane-offset': `${timelineLaneOffset}px`,
        '--timeline-min-stroke-width': `${minimumDevicePixelStrokeWidth}px`,
    } as CSSProperties

    return (
        <div className='education-and-work-timeline' style={timelineStyle} ref={timelineRef}>
            <svg className='education-and-work-timeline-axis' viewBox={`0 0 ${timelineWidth || 1} ${timelineHeight}`} preserveAspectRatio='none' aria-hidden='true' focusable='false'>
                <line className='education-and-work-timeline-axis-line' x1={timelineWidth * timelineAxisRatio} x2={timelineWidth * timelineAxisRatio} y1={0} y2={timelineHeight} />
            </svg>
            <ol className='education-and-work-timeline-entries'>
                {entries.map((entry) => (
                    <TimelineItem entry={entry} scale={scale} timelineWidth={timelineWidth} timelineHeight={timelineHeight} titleOffset={titleLayout.offsets.get(entry.id) ?? entry.geometry.titleOffset ?? 0} titleHeight={titleLayout.heights.get(entry.id) ?? 0} titleWidth={titleLayout.widths.get(entry.id) ?? 0} connectorY={titleLayout.connectorYs.get(entry.id)} endpointPositions={endpointPositions} dateLabelSides={titleLayout.dateLabelSides} active={activeEntryId === entry.id} onOpen={openEntry} key={entry.id} />
                ))}
            </ol>
            <ModalDisplay open={selectedEntry !== null} title={selectedEntry?.title ?? ''} links={selectedEntry?.links} images={selectedEntry?.images} onClosing={() => setActiveEntryId(null)} onClosed={() => setSelectedEntry(null)} returnFocusRef={triggerRef} restoreFocus={restoreFocus}>
                {selectedEntry && (
                    <>
                        <p className='mb-1'>{selectedEntry.organization} · {selectedEntry.location}</p>
                        <p className='education-and-work-timeline-date mb-0'>{selectedEntry.period}</p>
                        {selectedEntry.description && <p className='mb-0 mt-3'>{selectedEntry.description}</p>}
                    </>
                )}
            </ModalDisplay>
        </div>
    )
}
