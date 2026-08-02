import type { TimelineDateSide, TimelineEntry, TimelineMonth, TimelineScale } from './timeline-types'

export const timelinePixelsPerMonth = 18
export const nearbyDateRangeMonths = 2
export const timelineAxisRatio = 0.44
export const timelineTitleLeftEdgeRatio = 0.35
export const timelineTitleRightEdgeRatio = 0.65
export const timelineLaneOffset = 20
export const timelineConnectorOverlap = 12
export const timelineDotRadius = 5.4
export const timelineDotHitRadius = 11
export const timelineTitleGap = 8

export const durationLineDuration = 0.72
export const endpointRevealDuration = 0.3
export const connectorDuration = 0.46
export const titleRevealDuration = 0.22

const TIMELINE_BASELINE: TimelineMonth = { year: 2018, month: 1 }

export function createTimelineScale(now = new Date()): TimelineScale {
    const current = { year: now.getFullYear(), month: now.getMonth() + 1 }

    return {
        baseline: TIMELINE_BASELINE,
        current,
        months: monthIndex(current, TIMELINE_BASELINE) + 1,
    }
}

export function getDateLabelSides(entries: readonly TimelineEntry[]): ReadonlyMap<string, TimelineDateSide> {
    const labelsByMonth = new Map<string, { id: string; lane: number; month: TimelineMonth; side: TimelineDateSide; titleSide: TimelineDateSide }>()

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

export function resolveTimelineTitleOffsets(entries: readonly TimelineEntry[], scale: TimelineScale, timelineHeight: number, titleHeights: ReadonlyMap<string, number>): ReadonlyMap<string, number> {
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

export function getEntryAnchor(entry: TimelineEntry, scale: TimelineScale): number {
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

export function mapsMatch(first: ReadonlyMap<string, number>, second: ReadonlyMap<string, number>): boolean {
    return first.size === second.size && [...first].every(([key, value]) => second.get(key) === value)
}

export function monthIndex(month: TimelineMonth, baseline: TimelineMonth): number {
    return (month.year - baseline.year) * 12 + month.month - baseline.month
}

export function monthPosition(month: TimelineMonth, scale: TimelineScale): number {
    return 100 - (monthIndex(month, scale.baseline) / (scale.months - 1)) * 100
}

export function formatAxisMonth(month: TimelineMonth): string {
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(month.year, month.month - 1, 1))
}
