import { describe, expect, it } from 'vitest'
import { createTimelineScale, getDateLabelSides, getTimelineConnectorPath, monthPosition, resolveTimelineDateLabelSides, resolveTimelineEndpointPositions, resolveTimelineTitleLayout, resolveTimelineTitleOffsets, timelineConnectorObstacleClearance, timelineDotRadius, timelineLaneOffset, timelinePixelsPerMonth } from './timeline-layout'
import type { TimelineEntry } from './timeline-types'

describe('timeline scale and positioning', () => {
    it('creates a deterministic inclusive month scale', () => {
        const scale = createTimelineScale(new Date(2026, 7, 1))

        expect(scale).toEqual({
            baseline: { year: 2018, month: 6 },
            current: { year: 2026, month: 8 },
            months: 99,
        })
        expect(monthPosition(scale.baseline, scale)).toBe(100)
        expect(monthPosition(scale.current, scale)).toBe(0)
    })
})

describe('timeline date label placement', () => {
    it('moves a main-lane date away from a nearby left-side title cluster', () => {
        const entries = [
            createEntry('duration', {
                type: 'duration',
                start: { year: 2020, month: 1 },
                end: { year: 2021, month: 1 },
            }),
            createEntry('point', {
                type: 'point',
                at: { year: 2020, month: 2 },
            }),
        ]
        const sides = getDateLabelSides(entries)

        expect(sides.get('duration:start')).toBe('right')
        expect(sides.get('point:point')).toBe('right')
    })

    it('places dates opposite their selected title side', () => {
        const entries = [
            createEntry('duration', {
                type: 'duration',
                start: { year: 2020, month: 1 },
                end: { year: 2021, month: 1 },
                titleSide: 'right',
            }),
            createEntry('point', {
                type: 'point',
                at: { year: 2020, month: 2 },
            }),
        ]
        const sides = getDateLabelSides(entries)

        expect(sides.get('duration:start')).toBe('left')
        expect(sides.get('point:point')).toBe('right')
    })

    it('shows a shared ongoing label only once on the outermost lane', () => {
        const entries = [
            createEntry('education', {
                type: 'duration',
                start: { year: 2022, month: 8 },
                end: 'current',
            }),
            createEntry('work', {
                type: 'duration',
                start: { year: 2025, month: 6 },
                end: 'current',
                lane: 1,
                titleSide: 'right',
            }),
        ]
        const sides = getDateLabelSides(entries)

        expect(sides.has('education:end')).toBe(false)
        expect(sides.get('work:end')).toBe('left')
    })

    it('moves a label away from a measured card occupying its preferred side', () => {
        const entries = [
            createEntry('school', {
                type: 'duration',
                start: { year: 2019, month: 8 },
                end: { year: 2022, month: 6 },
            }),
            createEntry('work', {
                type: 'duration',
                start: { year: 2022, month: 5 },
                end: { year: 2022, month: 8 },
                lane: 1,
                titleSide: 'right',
            }),
        ]
        const defaultSides = getDateLabelSides(entries)
        const sides = resolveTimelineDateLabelSides(
            entries,
            defaultSides,
            new Map([
                ['school:start', 300],
                ['school:end', 100],
                ['work:start', 124],
                ['work:end', 60],
            ]),
            new Map(),
            new Map(),
            new Map([['school', 40], ['work', 40]]),
            new Map([['school', 80], ['work', 80]]),
            new Map([['school:end', { width: 60, height: 16 }]]),
            200,
            13.6,
        )

        expect(defaultSides.get('school:end')).toBe('right')
        expect(sides.get('school:end')).toBe('left')
    })
})

describe('timeline endpoint collision resolution', () => {
    it('gives adjacent months a readable global minimum gap across lanes', () => {
        const scale = createTimelineScale(new Date(2026, 7, 1))
        const entries = [
            createEntry('august', { type: 'point', at: { year: 2019, month: 8 } }),
            createEntry('july', { type: 'point', at: { year: 2019, month: 7 }, lane: 1 }),
            createEntry('june', { type: 'point', at: { year: 2019, month: 6 } }),
        ]
        const positions = resolveTimelineEndpointPositions(entries, scale, scale.months * timelinePixelsPerMonth)

        expect(positions.get('july:point')! - positions.get('august:point')!).toBeGreaterThanOrEqual(24)
        expect(positions.get('june:point')! - positions.get('july:point')!).toBeGreaterThanOrEqual(24)
    })

    it('keeps endpoints from the same month aligned across lanes', () => {
        const scale = createTimelineScale(new Date(2026, 7, 1))
        const entries = [
            createEntry('education', { type: 'point', at: { year: 2022, month: 8 } }),
            createEntry('work', { type: 'point', at: { year: 2022, month: 8 }, lane: 1 }),
        ]
        const positions = resolveTimelineEndpointPositions(entries, scale, scale.months * timelinePixelsPerMonth)

        expect(positions.get('education:point')).toBe(positions.get('work:point'))
    })
})

describe('timeline title collision resolution', () => {
    it('separates titles sharing the same anchor by their heights and configured gap', () => {
        const scale = createTimelineScale(new Date(2026, 7, 1))
        const entries = [
            createEntry('first', { type: 'point', at: { year: 2020, month: 1 } }),
            createEntry('second', { type: 'point', at: { year: 2020, month: 1 } }),
        ]
        const offsets = resolveTimelineTitleOffsets(entries, scale, 1000, new Map([
            ['first', 40],
            ['second', 40],
        ]))

        expect(offsets).toEqual(new Map([
            ['first', -28],
            ['second', 28],
        ]))
    })

    it('derives an explicit offset from the measured card edge clearance', () => {
        const scale = createTimelineScale(new Date(2026, 7, 1))
        const entry = createEntry('offset', {
            type: 'point',
            at: { year: 2020, month: 1 },
            titleOffset: 32,
        })

        expect(resolveTimelineTitleOffsets([entry], scale, 1000, new Map([['offset', 40]]))).toEqual(new Map([['offset', 28]]))
    })

    it('moves a connector row beyond a foreign endpoint on its horizontal route', () => {
        const scale = createTimelineScale(new Date(2026, 7, 1))
        const entries = [
            createEntry('ongoing', {
                type: 'duration',
                start: { year: 2025, month: 6 },
                end: 'current',
                lane: 1,
                titleSide: 'right',
            }),
            createEntry('internship', {
                type: 'duration',
                start: { year: 2026, month: 1 },
                end: { year: 2026, month: 5 },
                lane: 2,
                titleSide: 'right',
            }),
        ]
        const endpointPositions = new Map([
            ['ongoing:start', 160],
            ['ongoing:end', 0],
            ['internship:start', 80],
            ['internship:end', 40],
        ])
        const layout = resolveTimelineTitleLayout(
            entries,
            scale,
            1000,
            new Map([['ongoing', 40], ['internship', 40]]),
            new Map([['ongoing', 200], ['internship', 200]]),
            endpointPositions,
            1000,
        )

        const connectorY = layout.connectorYs.get('ongoing') ?? 0

        expect(connectorY).toBeGreaterThan(80 + timelineConnectorObstacleClearance)
        expect(connectorY - 80 - timelineDotRadius).toBeGreaterThanOrEqual(timelineLaneOffset)
    })

    it('does not treat a shared departure lane as a horizontal obstacle', () => {
        const scale = createTimelineScale(new Date(2026, 7, 1))
        const entries = [
            createEntry('point', {
                type: 'point',
                at: { year: 2020, month: 1 },
                titleOffset: -32,
            }),
            createEntry('duration', {
                type: 'duration',
                start: { year: 2019, month: 1 },
                end: { year: 2021, month: 1 },
                titleSide: 'right',
            }),
        ]
        const layout = resolveTimelineTitleLayout(
            entries,
            scale,
            1000,
            new Map([['point', 40], ['duration', 40]]),
            new Map([['point', 200], ['duration', 200]]),
            new Map([['point:point', 100], ['duration:start', 120], ['duration:end', 80]]),
            1000,
        )

        expect(layout.connectorYs.get('point')).toBe(100)
    })
})

describe('timeline title connector routing', () => {
    it('connects vertically offset cards through their nearest center edge', () => {
        const shared = {
            laneX: 440,
            anchorY: 200,
            titleEdgeX: 350,
            titleHeight: 40,
            titleWidth: 200,
            timelineWidth: 1000,
            connectorY: 200,
        }

        expect(getTimelineConnectorPath({ ...shared, titleSide: 'left', titleOffset: -40 })).toBe('M 440 200 H 100 V 179')
        expect(getTimelineConnectorPath({ ...shared, titleSide: 'right', titleOffset: 40 })).toBe('M 440 200 H 900 V 221')
    })

    it('keeps a centered card connected through its side edge', () => {
        expect(getTimelineConnectorPath({
            laneX: 440,
            anchorY: 200,
            connectorY: 200,
            titleEdgeX: 350,
            titleSide: 'left',
            titleOffset: 0,
            titleHeight: 40,
            titleWidth: 200,
            timelineWidth: 1000,
        })).toBe('M 440 200 H 199')
    })

    it('moves along the lane before routing horizontally around an obstacle', () => {
        expect(getTimelineConnectorPath({
            laneX: 440,
            anchorY: 200,
            connectorY: 212,
            titleEdgeX: 350,
            titleSide: 'right',
            titleOffset: 40,
            titleHeight: 40,
            titleWidth: 200,
            timelineWidth: 1000,
        })).toBe('M 440 200 V 212 H 900 V 221')
    })
})

function createEntry(id: string, geometry: TimelineEntry['geometry']): TimelineEntry {
    return {
        id,
        title: `${id} title`,
        organization: `${id} organization`,
        location: `${id} location`,
        period: `${id} period`,
        geometry,
    }
}
