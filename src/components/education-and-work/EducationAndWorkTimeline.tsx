import { useMemo, useRef, useState, type CSSProperties } from 'react'
import ModalDisplay from '../ModalDisplay'
import TimelineItem from './TimelineItem'
import { useElementWidth, useMinimumDevicePixelStrokeWidth, useTimelineTitleOffsets } from './timeline-hooks'
import { formatAxisMonth, getDateLabelSides, timelineAxisRatio, timelineLaneOffset, timelinePixelsPerMonth, timelineTitleLeftEdgeRatio } from './timeline-layout'
import type { TimelineEntry, TimelineScale } from './timeline-types'

type EducationAndWorkTimelineProps = {
    entries: readonly TimelineEntry[]
    scale: TimelineScale
}

export default function EducationAndWorkTimeline({ entries, scale }: EducationAndWorkTimelineProps) {
    const timelineRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const [selectedEntry, setSelectedEntry] = useState<TimelineEntry | null>(null)
    const timelineWidth = useElementWidth(timelineRef)
    const minimumDevicePixelStrokeWidth = useMinimumDevicePixelStrokeWidth()
    const timelineHeight = scale.months * timelinePixelsPerMonth
    const titleOffsets = useTimelineTitleOffsets(timelineRef, entries, scale, timelineHeight, timelineWidth)
    const dateLabelSides = useMemo(() => getDateLabelSides(entries), [entries])

    function openEntry(entry: TimelineEntry, trigger: HTMLButtonElement) {
        triggerRef.current = trigger
        setSelectedEntry(entry)
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
            <span className='education-and-work-timeline-axis-label education-and-work-timeline-axis-label--end'>{formatAxisMonth(scale.baseline)}</span>
            <ol className='education-and-work-timeline-entries'>
                {entries.map((entry) => (
                    <TimelineItem entry={entry} scale={scale} timelineWidth={timelineWidth} timelineHeight={timelineHeight} titleOffset={titleOffsets.get(entry.id) ?? entry.geometry.titleOffset ?? 0} dateLabelSides={dateLabelSides} onOpen={openEntry} key={entry.id} />
                ))}
            </ol>
            <ModalDisplay open={selectedEntry !== null} title={selectedEntry?.title ?? ''} links={selectedEntry?.links} images={selectedEntry?.images} onClosed={() => setSelectedEntry(null)} returnFocusRef={triggerRef}>
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
