import type { TimelineDateSide, TimelineEntry, TimelineMonth, TimelineScale } from './timeline-types'

export const timelinePixelsPerMonth = 12
export const timelineAxisRatio = 0.44
export const timelineTitleLeftEdgeRatio = 0.35
export const timelineTitleRightEdgeRatio = 0.65
export const timelineLaneOffset = 20
export const timelineConnectorOverlap = 1
export const timelineConnectorClearance = 8
export const timelineDotRadius = 5.4
export const timelineDotHitRadius = 11
export const timelineEndpointGap = 24
export const timelineTitleGap = 16

export const durationLineDuration = 0.72
export const endpointRevealDuration = 0.3
export const connectorDuration = 0.46
export const titleRevealDuration = 0.22

const TIMELINE_BASELINE: TimelineMonth = { year: 2018, month: 6 }
export const timelineConnectorObstacleClearance = timelineDotRadius + timelineLaneOffset
const timelineDateLabelClearance = 4

type TimelineDateLabel = {
    id: string
    lane: number
    month: TimelineMonth | 'current'
    side: TimelineDateSide
}

type TimelineTitlePosition = {
    entry: TimelineEntry
    id: string
    side: TimelineDateSide
    height: number
    width: number
    anchor: number
    center: number
}

type TimelineRect = {
    left: number
    top: number
    right: number
    bottom: number
}

export type TimelineTitleLayout = {
    offsets: ReadonlyMap<string, number>
    connectorYs: ReadonlyMap<string, number>
}

export function createTimelineScale(now = new Date()): TimelineScale {
    const current = { year: now.getFullYear(), month: now.getMonth() + 1 }

    return {
        baseline: TIMELINE_BASELINE,
        current,
        months: monthIndex(current, TIMELINE_BASELINE) + 1,
    }
}

export function getDateLabelSides(entries: readonly TimelineEntry[]): ReadonlyMap<string, TimelineDateSide> {
    return new Map(getVisibleDateLabels(entries).map((label) => [label.id, label.side]))
}

export function resolveTimelineDateLabelSides(entries: readonly TimelineEntry[], defaultSides: ReadonlyMap<string, TimelineDateSide>, endpointPositions: ReadonlyMap<string, number>, titleOffsets: ReadonlyMap<string, number>, connectorYs: ReadonlyMap<string, number>, titleHeights: ReadonlyMap<string, number>, titleWidths: ReadonlyMap<string, number>, labelSizes: ReadonlyMap<string, { width: number; height: number }>, timelineWidth: number, dateGap: number): ReadonlyMap<string, TimelineDateSide> {
    if (timelineWidth === 0) {
        return defaultSides
    }

    const resolvedCards = entries.map((entry) => {
        const anchor = getEntryAnchorFromPositions(entry, endpointPositions)

        return {
            id: entry.id,
            rect: createTitleRect(entry.geometry.titleSide ?? 'left', titleWidths.get(entry.id) ?? 0, titleHeights.get(entry.id) ?? 0, anchor + (titleOffsets.get(entry.id) ?? 0), timelineWidth),
        }
    })
    const placedLabels: TimelineRect[] = []
    const connectors = entries.map((entry) => {
        const anchor = getEntryAnchorFromPositions(entry, endpointPositions)
        const offset = titleOffsets.get(entry.id) ?? 0
        const side = entry.geometry.titleSide ?? 'left'
        const titleWidth = titleWidths.get(entry.id) ?? 0
        const laneX = getEntryLaneX(entry, timelineWidth)
        const titleX = offset === 0
            ? side === 'right'
                ? timelineWidth - titleWidth
                : titleWidth
            : side === 'right'
                ? timelineWidth - titleWidth / 2
                : titleWidth / 2
        const connectorY = connectorYs.get(entry.id) ?? anchor

        return {
            left: Math.min(laneX, titleX),
            top: connectorY - 2,
            right: Math.max(laneX, titleX),
            bottom: connectorY + 2,
        }
    })
    const visibleLabels = getVisibleDateLabels(entries)
        .sort((first, second) => getLabelY(first, endpointPositions) - getLabelY(second, endpointPositions))
    const sides = new Map<string, TimelineDateSide>()

    for (const label of visibleLabels) {
        const size = labelSizes.get(label.id)

        if (!size) {
            sides.set(label.id, defaultSides.get(label.id) ?? label.side)
            continue
        }

        const preferredSide = defaultSides.get(label.id) ?? label.side
        const candidates = ([preferredSide, preferredSide === 'left' ? 'right' : 'left'] as const).map((side) => {
            const rect = createDateLabelRect(label, side, getLabelY(label, endpointPositions), size, timelineWidth, dateGap)
            let score = side === preferredSide ? 0 : 1

            if (rect.left < 0 || rect.right > timelineWidth) {
                score += 1000
            }

            score += resolvedCards.filter((card) => rectanglesOverlap(rect, card.rect, timelineDateLabelClearance)).length * 100
            score += connectors.filter((connector) => rectanglesOverlap(rect, connector, timelineDateLabelClearance)).length * 100
            score += placedLabels.filter((placed) => rectanglesOverlap(rect, placed, timelineDateLabelClearance)).length * 50

            return { side, rect, score }
        })
        const selected = candidates.sort((first, second) => first.score - second.score)[0]

        sides.set(label.id, selected.side)
        placedLabels.push(selected.rect)
    }

    return sides
}

export function resolveTimelineEndpointPositions(entries: readonly TimelineEntry[], scale: TimelineScale, timelineHeight: number): ReadonlyMap<string, number> {
    const endpoints = getTimelineEndpoints(entries, scale)
    const positionsByMonth = new Map<string, { center: number }>()

    for (const endpoint of endpoints) {
        const key = timelineMonthKey(endpoint.month)

        if (!positionsByMonth.has(key)) {
            positionsByMonth.set(key, { center: monthPosition(endpoint.month, scale) * timelineHeight / 100 })
        }
    }

    const monthPositions = [...positionsByMonth.values()].sort((first, second) => first.center - second.center)

    separatePositions(monthPositions, timelineEndpointGap)

    const first = monthPositions[0]
    const last = monthPositions.at(-1)

    if (first && first.center < 0) {
        const adjustment = -first.center
        monthPositions.forEach((position) => position.center += adjustment)
    }

    if (last && last.center > timelineHeight) {
        const adjustment = last.center - timelineHeight
        monthPositions.forEach((position) => position.center -= adjustment)
    }

    return new Map(endpoints.map((endpoint) => [endpoint.id, roundPosition(positionsByMonth.get(timelineMonthKey(endpoint.month))?.center ?? 0)]))
}

export function resolveTimelineTitleLayout(entries: readonly TimelineEntry[], scale: TimelineScale, timelineHeight: number, titleHeights: ReadonlyMap<string, number>, titleWidths: ReadonlyMap<string, number>, endpointPositions: ReadonlyMap<string, number>, timelineWidth: number): TimelineTitleLayout {
    const titlePositions = entries.map((entry) => {
        const anchor = getEntryAnchorY(entry, scale, timelineHeight, endpointPositions)
        const desiredOffset = entry.geometry.titleOffset ?? 0
        const height = titleHeights.get(entry.id) ?? 0

        return {
            entry,
            id: entry.id,
            side: entry.geometry.titleSide ?? 'left',
            height,
            width: titleWidths.get(entry.id) ?? 0,
            anchor,
            center: anchor + enforceConnectorClearance(desiredOffset, height),
        }
    })

    for (let pass = 0; pass < titlePositions.length * 2; pass += 1) {
        separateTimelineTitles(titlePositions)

        if (timelineWidth === 0 || !moveConnectorsAroundObstacles(titlePositions, entries, endpointPositions, timelineWidth)) {
            break
        }
    }

    separateTimelineTitles(titlePositions)

    return {
        offsets: new Map(titlePositions.map((position) => [position.id, roundPosition(position.center - position.anchor)])),
        connectorYs: new Map(titlePositions.map((position) => [position.id, roundPosition(getConnectorY(position))])),
    }
}

export function resolveTimelineTitleOffsets(entries: readonly TimelineEntry[], scale: TimelineScale, timelineHeight: number, titleHeights: ReadonlyMap<string, number>, endpointPositions: ReadonlyMap<string, number> = new Map()): ReadonlyMap<string, number> {
    return resolveTimelineTitleLayout(entries, scale, timelineHeight, titleHeights, new Map(), endpointPositions, 0).offsets
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

export function getEntryAnchorY(entry: TimelineEntry, scale: TimelineScale, timelineHeight: number, endpointPositions: ReadonlyMap<string, number>): number {
    const geometry = entry.geometry
    const startId = geometry.type === 'duration' ? `${entry.id}:start` : `${entry.id}:point`
    const startMonth = geometry.type === 'duration' ? geometry.start : geometry.at
    const start = endpointPositions.get(startId) ?? monthPosition(startMonth, scale) * timelineHeight / 100

    if (geometry.type === 'point') {
        return start
    }

    const endMonth = geometry.end === 'current' ? scale.current : geometry.end
    const end = endpointPositions.get(`${entry.id}:end`) ?? monthPosition(endMonth, scale) * timelineHeight / 100

    return (start + end) / 2
}

export function mapsMatch<Key, Value>(first: ReadonlyMap<Key, Value>, second: ReadonlyMap<Key, Value>): boolean {
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

type TimelineConnectorPathOptions = {
    laneX: number
    anchorY: number
    connectorY: number
    titleEdgeX: number
    titleSide: TimelineDateSide
    titleOffset: number
    titleHeight: number
    titleWidth: number
    timelineWidth: number
}

export function getTimelineConnectorPath({ laneX, anchorY, connectorY, titleEdgeX, titleSide, titleOffset, titleHeight, titleWidth, timelineWidth }: TimelineConnectorPathOptions): string {
    const start = `M ${laneX} ${anchorY}${Math.abs(connectorY - anchorY) < 0.01 ? '' : ` V ${connectorY}`}`

    if (titleOffset !== 0 && titleHeight > 0 && titleWidth > 0) {
        const titleCenterX = titleSide === 'right' ? timelineWidth - titleWidth / 2 : titleWidth / 2
        const titleEdgeY = anchorY + titleOffset - Math.sign(titleOffset) * titleHeight / 2
        const titleOverlapY = titleEdgeY + Math.sign(titleOffset) * timelineConnectorOverlap

        return `${start} H ${titleCenterX} V ${titleOverlapY}`
    }

    const measuredTitleEdgeX = titleWidth > 0
        ? titleSide === 'right'
            ? timelineWidth - titleWidth
            : titleWidth
        : titleEdgeX
    const titleOverlapX = measuredTitleEdgeX + (titleSide === 'right' ? timelineConnectorOverlap : -timelineConnectorOverlap)

    return `${start} H ${titleOverlapX}`
}

function getVisibleDateLabels(entries: readonly TimelineEntry[]): TimelineDateLabel[] {
    const labelsByMonth = new Map<string, TimelineDateLabel>()

    for (const entry of entries) {
        const geometry = entry.geometry
        const lane = geometry.lane ?? 0
        const titleSide = geometry.titleSide ?? 'left'
        const side = titleSide === 'right' ? 'left' : 'right'
        const labels: TimelineDateLabel[] = geometry.type === 'duration'
            ? [
                  { id: `${entry.id}:start`, lane, month: geometry.start, side },
                  { id: `${entry.id}:end`, lane, month: geometry.end, side },
              ]
            : [{ id: `${entry.id}:point`, lane, month: geometry.at, side }]

        for (const label of labels) {
            const key = label.month === 'current' ? 'current' : timelineMonthKey(label.month)
            const current = labelsByMonth.get(key)

            if (!current || lane > current.lane) {
                labelsByMonth.set(key, label)
            }
        }
    }

    return [...labelsByMonth.values()]
}

function getTimelineEndpoints(entries: readonly TimelineEntry[], scale: TimelineScale) {
    return entries.flatMap((entry) => {
        const geometry = entry.geometry

        if (geometry.type === 'point') {
            return [{ id: `${entry.id}:point`, month: geometry.at }]
        }

        return [
            { id: `${entry.id}:start`, month: geometry.start },
            { id: `${entry.id}:end`, month: geometry.end === 'current' ? scale.current : geometry.end },
        ]
    })
}

function getEntryAnchorFromPositions(entry: TimelineEntry, endpointPositions: ReadonlyMap<string, number>): number {
    const geometry = entry.geometry
    const start = endpointPositions.get(geometry.type === 'duration' ? `${entry.id}:start` : `${entry.id}:point`) ?? 0

    if (geometry.type === 'point') {
        return start
    }

    return (start + (endpointPositions.get(`${entry.id}:end`) ?? start)) / 2
}

function getLabelY(label: TimelineDateLabel, endpointPositions: ReadonlyMap<string, number>): number {
    return endpointPositions.get(label.id) ?? 0
}

function createTitleRect(side: TimelineDateSide, width: number, height: number, center: number, timelineWidth: number): TimelineRect {
    return {
        left: side === 'right' ? timelineWidth - width : 0,
        top: center - height / 2,
        right: side === 'right' ? timelineWidth : width,
        bottom: center + height / 2,
    }
}

function createDateLabelRect(label: TimelineDateLabel, side: TimelineDateSide, center: number, size: { width: number; height: number }, timelineWidth: number, dateGap: number): TimelineRect {
    const axisX = timelineWidth * timelineAxisRatio
    const right = side === 'left' ? axisX - dateGap : axisX + label.lane * timelineLaneOffset + dateGap + size.width

    return {
        left: right - size.width,
        top: center - size.height / 2,
        right,
        bottom: center + size.height / 2,
    }
}

function enforceConnectorClearance(offset: number, titleHeight: number): number {
    if (offset === 0 || titleHeight === 0) {
        return offset
    }

    return Math.sign(offset) * (titleHeight / 2 + timelineConnectorClearance)
}

function separateTimelineTitles(titlePositions: TimelineTitlePosition[]) {
    for (let pass = 0; pass < titlePositions.length; pass += 1) {
        let foundCollision = false

        for (const side of ['left', 'right'] as const) {
            const sidePositions = titlePositions
                .filter((position) => position.side === side && position.height > 0)
                .sort((first, second) => first.center - second.center)

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
        }

        titlePositions.forEach((position) => {
            const offset = position.center - position.anchor

            if (offset !== 0 && Math.abs(offset) < position.height / 2 + timelineConnectorClearance) {
                position.center = position.anchor + enforceConnectorClearance(offset, position.height)
                foundCollision = true
            }
        })

        if (!foundCollision) {
            break
        }
    }
}

function moveConnectorsAroundObstacles(titlePositions: TimelineTitlePosition[], entries: readonly TimelineEntry[], endpointPositions: ReadonlyMap<string, number>, timelineWidth: number): boolean {
    let moved = false

    for (const position of titlePositions) {
        const direction = Math.sign(position.center - position.anchor)

        if (direction === 0 || position.width === 0 || position.height === 0) {
            continue
        }

        const connectorY = getConnectorY(position)
        const laneX = getEntryLaneX(position.entry, timelineWidth)
        const titleCenterX = position.side === 'right' ? timelineWidth - position.width / 2 : position.width / 2
        const xRange = [Math.min(laneX, titleCenterX), Math.max(laneX, titleCenterX)] as const
        const obstacles = getConnectorObstacleIntervals(position, titlePositions, entries, endpointPositions, timelineWidth, xRange)
        const clearY = moveOutsideIntervals(connectorY, direction, obstacles)

        if (clearY !== connectorY) {
            position.center += clearY - connectorY
            moved = true
        }
    }

    return moved
}

function getConnectorObstacleIntervals(position: TimelineTitlePosition, titlePositions: TimelineTitlePosition[], entries: readonly TimelineEntry[], endpointPositions: ReadonlyMap<string, number>, timelineWidth: number, xRange: readonly [number, number]): TimelineRect[] {
    const obstacles: TimelineRect[] = []
    const connectorLaneX = getEntryLaneX(position.entry, timelineWidth)

    for (const other of titlePositions) {
        if (other.id === position.id) {
            continue
        }

        const rect = createTitleRect(other.side, other.width, other.height, other.center, timelineWidth)

        if (rangesOverlap(xRange[0], xRange[1], rect.left, rect.right)) {
            obstacles.push({ ...rect, top: rect.top - timelineConnectorOverlap, bottom: rect.bottom + timelineConnectorOverlap })
        }
    }

    for (const entry of entries) {
        if (entry.id === position.id) {
            continue
        }

        const laneX = getEntryLaneX(entry, timelineWidth)

        if (Math.abs(laneX - connectorLaneX) < 0.01 || laneX < xRange[0] || laneX > xRange[1]) {
            continue
        }

        const geometry = entry.geometry
        const startId = geometry.type === 'duration' ? `${entry.id}:start` : `${entry.id}:point`
        const start = endpointPositions.get(startId) ?? 0

        if (geometry.type === 'duration') {
            const end = endpointPositions.get(`${entry.id}:end`) ?? start

            obstacles.push({ left: laneX, right: laneX, top: Math.min(start, end) - 2, bottom: Math.max(start, end) + 2 })
            obstacles.push(createPointObstacle(laneX, start))

            if (geometry.end !== 'current') {
                obstacles.push(createPointObstacle(laneX, end))
            }
        } else {
            obstacles.push(createPointObstacle(laneX, start))
        }
    }

    return obstacles
}

function createPointObstacle(x: number, y: number): TimelineRect {
    return {
        left: x - timelineConnectorObstacleClearance,
        top: y - timelineConnectorObstacleClearance,
        right: x + timelineConnectorObstacleClearance,
        bottom: y + timelineConnectorObstacleClearance,
    }
}

function moveOutsideIntervals(start: number, direction: number, intervals: readonly TimelineRect[]): number {
    let candidate = start

    for (let pass = 0; pass <= intervals.length; pass += 1) {
        const collisions = intervals.filter((interval) => candidate >= interval.top && candidate <= interval.bottom)

        if (collisions.length === 0) {
            break
        }

        candidate = direction > 0
            ? Math.max(...collisions.map((collision) => collision.bottom)) + 1
            : Math.min(...collisions.map((collision) => collision.top)) - 1
    }

    return candidate
}

function getConnectorY(position: TimelineTitlePosition): number {
    const direction = Math.sign(position.center - position.anchor)

    if (direction === 0) {
        return position.anchor
    }

    return position.center - direction * (position.height / 2 + timelineConnectorClearance)
}

function getEntryLaneX(entry: TimelineEntry, timelineWidth: number): number {
    return timelineWidth * timelineAxisRatio + (entry.geometry.lane ?? 0) * timelineLaneOffset
}

function rectanglesOverlap(first: TimelineRect, second: TimelineRect, gap = 0): boolean {
    return first.left < second.right + gap
        && first.right + gap > second.left
        && first.top < second.bottom + gap
        && first.bottom + gap > second.top
}

function rangesOverlap(firstStart: number, firstEnd: number, secondStart: number, secondEnd: number): boolean {
    return firstStart <= secondEnd && firstEnd >= secondStart
}

function separatePositions(positions: { center: number }[], gap: number) {
    if (positions.length < 2) {
        return
    }

    const originalCenter = positions.reduce((sum, position) => sum + position.center, 0) / positions.length

    for (let index = 1; index < positions.length; index += 1) {
        positions[index].center = Math.max(positions[index].center, positions[index - 1].center + gap)
    }

    const separatedCenter = positions.reduce((sum, position) => sum + position.center, 0) / positions.length
    const adjustment = separatedCenter - originalCenter

    positions.forEach((position) => position.center -= adjustment)
}

function timelineMonthKey(month: TimelineMonth): string {
    return `${month.year}-${month.month}`
}

function roundPosition(position: number): number {
    return Math.round(position * 100) / 100
}
