import { useId, useRef, useState, type CSSProperties } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'

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
          titleOffset?: number
          startDateOffset?: number
          endDateOffset?: number
      }
    | {
          type: 'point'
          at: TimelineMonth
          titleOffset?: number
          dateOffset?: number
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

export function createTimelineScale(now = new Date()): TimelineScale {
    const current = { year: now.getFullYear(), month: now.getMonth() + 1 }

    return {
        baseline: TIMELINE_BASELINE,
        current,
        months: monthIndex(current, TIMELINE_BASELINE) + 1,
    }
}

export const educationTimeline: readonly TimelineEntry[] = [
    {
        id: 'jamk-ict-2022',
        title: "Bachelor's Degree Programme in Information and Communication Technology",
        organization: 'JAMK University of Applied Sciences',
        location: 'Jyväskylä',
        period: 'Aug 2022 – thesis planned for autumn 2026',
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
        period: 'Aug 2019 – Jun 2022',
        geometry: {
            type: 'duration',
            start: { year: 2019, month: 8 },
            end: { year: 2022, month: 6 },
        },
    },
]

export const workTimeline: readonly TimelineEntry[] = [
    {
        id: 'exen-intern-2026',
        title: 'Software Development Intern',
        organization: 'EXEN esports Oy',
        location: 'Jyväskylä / Hybrid',
        period: 'Jan – May 2026',
        description: 'Worked across application development, technical auditing, WordPress/PHP improvements, cloud-hosting and CI/CD research, and partner project support.',
        geometry: {
            type: 'duration',
            start: { year: 2026, month: 1 },
            end: { year: 2026, month: 5 },
            lane: 1,
            endDateOffset: 8,
        },
    },
    {
        id: 'nuke-liiga-production-manager-2025',
        title: 'Production Manager',
        organization: 'NUKE-Liiga',
        location: 'Hybrid',
        period: 'Jun 2025 – May 2026',
        description: 'Handled broadcast preparation, technical execution, and in-game camerawork.',
        geometry: {
            type: 'duration',
            start: { year: 2025, month: 6 },
            end: { year: 2026, month: 5 },
            lane: -1,
            endDateOffset: -8,
        },
    },
    {
        id: 'abc-hirvaskangas-retail-2022',
        title: 'Retail Store Worker (summer job)',
        organization: 'ABC Hirvaskangas',
        location: 'Hirvaskangas',
        period: 'Summer 2022',
        description: 'Worked mainly on shelving, storage and dishes.',
        geometry: {
            type: 'duration',
            start: { year: 2022, month: 5 },
            end: { year: 2022, month: 8 },
        },
    },
    {
        id: 'k-citymarket-trainee-2019',
        title: 'Trainee (summer job)',
        organization: 'K-Citymarket Äänekoski',
        location: 'Äänekoski',
        period: 'Jul – Aug 2019',
        geometry: {
            type: 'point',
            at: { year: 2019, month: 7 },
            titleOffset: 22,
        },
    },
    {
        id: 'aanekoski-youth-counsellor-2019',
        title: "Youth counsellor's assistant (summer job)",
        organization: 'City of Äänekoski',
        location: 'Äänekoski',
        period: 'Jun – Jul 2019',
        geometry: {
            type: 'point',
            at: { year: 2019, month: 6 },
            titleOffset: -22,
        },
    },
    {
        id: 'huvikumpu-summer-trainee-2018',
        title: 'Summer trainee (summer job)',
        organization: 'Pienryhmäkoti Huvikumpu',
        location: 'Äänekoski',
        period: 'Jun 2018',
        geometry: {
            type: 'point',
            at: { year: 2018, month: 6 },
        },
    },
]

type BioTimelineProps = {
    entries: readonly TimelineEntry[]
    scale: TimelineScale
}

export default function BioTimeline({ entries, scale }: BioTimelineProps) {
    const dialogTitleId = useId()
    const dialogRef = useRef<HTMLDialogElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const [selectedEntry, setSelectedEntry] = useState<TimelineEntry | null>(null)

    function openEntry(entry: TimelineEntry, trigger: HTMLButtonElement) {
        triggerRef.current = trigger
        setSelectedEntry(entry)
        requestAnimationFrame(() => dialogRef.current?.showModal())
    }

    function closeEntry() {
        dialogRef.current?.close()
    }

    function restoreTriggerFocus() {
        setSelectedEntry(null)
        requestAnimationFrame(() => triggerRef.current?.focus())
    }

    const timelineStyle = {
        '--timeline-height': `${scale.months * timelinePixelsPerMonth}px`,
    } as CSSProperties

    return (
        <div className='bio-timeline' style={timelineStyle}>
            <div className='bio-timeline-axis' aria-hidden='true'></div>
            <span className='bio-timeline-axis-label bio-timeline-axis-label--start'>{formatAxisMonth(scale.baseline)}</span>
            <span className='bio-timeline-axis-label bio-timeline-axis-label--end'>{formatAxisMonth(scale.current)}</span>
            <ol className='bio-timeline-entries'>
                {entries.map((entry) => (
                    <TimelineItem entry={entry} scale={scale} onOpen={openEntry} key={entry.id} />
                ))}
            </ol>
            <dialog className='bio-timeline-dialog' ref={dialogRef} onClose={restoreTriggerFocus} aria-labelledby={dialogTitleId}>
                {selectedEntry && (
                    <div className='bio-timeline-dialog-content'>
                        <button className='bio-timeline-dialog-close' type='button' onClick={closeEntry} aria-label='Close'>Close</button>
                        <h3 id={dialogTitleId} className='h4 fw-semibold'>{selectedEntry.title}</h3>
                        <p className='mb-1'>{selectedEntry.organization} · {selectedEntry.location}</p>
                        <p className='bio-timeline-date mb-0'>{selectedEntry.period}</p>
                        {selectedEntry.description && <p className='mb-0 mt-3'>{selectedEntry.description}</p>}
                    </div>
                )}
            </dialog>
        </div>
    )
}

type TimelineItemProps = {
    entry: TimelineEntry
    scale: TimelineScale
    onOpen: (entry: TimelineEntry, trigger: HTMLButtonElement) => void
}

function TimelineItem({ entry, scale, onOpen }: TimelineItemProps) {
    const viewportAnchorRef = useRef<HTMLSpanElement>(null)
    const entryInView = useInView(viewportAnchorRef, { once: true, margin: '0px 0px -15% 0px' })
    const reducedMotion = useReducedMotion()
    const geometry = entry.geometry
    const isDuration = geometry.type === 'duration'
    const startMonth = geometry.type === 'duration' ? geometry.start : geometry.at
    const endMonth = geometry.type === 'duration'
        ? geometry.end === 'current'
            ? scale.current
            : geometry.end
        : geometry.at
    const start = monthPosition(startMonth, scale)
    const end = monthPosition(endMonth, scale)
    const anchor = isDuration ? (start + end) / 2 : start
    const titleOffset = geometry.titleOffset ?? 0
    const startDateOffset = geometry.type === 'duration' ? geometry.startDateOffset ?? 0 : geometry.dateOffset ?? 0
    const endDateOffset = geometry.type === 'duration' ? geometry.endDateOffset ?? 0 : 0
    const itemStyle = {
        '--entry-start': `${start}%`,
        '--entry-end': `${end}%`,
        '--entry-anchor': `${anchor}%`,
        '--entry-lane': geometry.type === 'duration' ? geometry.lane ?? 0 : 0,
        '--entry-title-offset': `${titleOffset}px`,
        '--entry-connector-height': `${Math.abs(titleOffset)}px`,
        '--entry-start-date-offset': `${startDateOffset}px`,
        '--entry-end-date-offset': `${endDateOffset}px`,
    } as CSSProperties
    const endpointDelay = isDuration ? durationLineDuration : 0
    const connectorDelay = endpointDelay + endpointRevealDuration
    const titleDelay = connectorDelay + connectorDuration
    const immediate = reducedMotion ? { duration: 0 } : undefined

    return (
        <motion.li className={`bio-timeline-entry${isDuration ? ' bio-timeline-entry--duration' : ' bio-timeline-entry--point'}${titleOffset > 0 ? ' bio-timeline-entry--title-down' : ''}${titleOffset < 0 ? ' bio-timeline-entry--title-up' : ''}`} style={itemStyle} initial='hidden' animate={reducedMotion || entryInView ? 'visible' : 'hidden'}>
            <span ref={viewportAnchorRef} className='bio-timeline-viewport-anchor' aria-hidden='true'></span>
            {isDuration && (
                <motion.span className='bio-timeline-segment' aria-hidden='true' variants={{ hidden: { scaleY: 0 }, visible: { scaleY: 1 } }} transition={{ duration: reducedMotion ? 0 : durationLineDuration, ease: 'easeInOut' }} />
            )}
            <motion.span className='bio-timeline-dot bio-timeline-dot--start' aria-hidden='true' variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }} transition={{ duration: reducedMotion ? 0 : endpointRevealDuration, delay: reducedMotion ? 0 : endpointDelay }} />
            {isDuration && <motion.span className='bio-timeline-dot bio-timeline-dot--end' aria-hidden='true' variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }} transition={{ duration: reducedMotion ? 0 : endpointRevealDuration, delay: reducedMotion ? 0 : endpointDelay }} />}
            <motion.span className='bio-timeline-entry-date bio-timeline-entry-date--start' variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} transition={{ duration: reducedMotion ? 0 : endpointRevealDuration, delay: reducedMotion ? 0 : endpointDelay }}>{formatAxisMonth(startMonth)}</motion.span>
            {isDuration && <motion.span className='bio-timeline-entry-date bio-timeline-entry-date--end' variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} transition={{ duration: reducedMotion ? 0 : endpointRevealDuration, delay: reducedMotion ? 0 : endpointDelay }}>{formatAxisMonth(endMonth)}</motion.span>}
            <motion.span className='bio-timeline-connector' aria-hidden='true' variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }} transition={{ duration: reducedMotion ? 0 : connectorDuration, delay: reducedMotion ? 0 : connectorDelay }} />
            {titleOffset !== 0 && <motion.span className='bio-timeline-connector-turn' aria-hidden='true' variants={{ hidden: { scaleY: 0 }, visible: { scaleY: 1 } }} transition={{ duration: reducedMotion ? 0 : connectorDuration, delay: reducedMotion ? 0 : connectorDelay }} />}
            <motion.button className='bio-timeline-title' type='button' onClick={(event) => onOpen(entry, event.currentTarget)} variants={{ hidden: { opacity: 0, x: 4 }, visible: { opacity: 1, x: 0 } }} transition={immediate ?? { duration: titleRevealDuration, delay: titleDelay }}>{entry.title}</motion.button>
        </motion.li>
    )
}

function monthIndex(month: TimelineMonth, baseline: TimelineMonth): number {
    return (month.year - baseline.year) * 12 + month.month - baseline.month
}

function monthPosition(month: TimelineMonth, scale: TimelineScale): number {
    return (monthIndex(month, scale.baseline) / (scale.months - 1)) * 100
}

function formatAxisMonth(month: TimelineMonth): string {
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(month.year, month.month - 1, 1))
}
