import { describe, expect, it } from 'vitest'
import { createTimelineScale, getDateLabelSides, monthPosition, resolveTimelineTitleOffsets } from './timeline-layout'
import type { TimelineEntry } from './timeline-types'

describe('timeline scale and positioning', () => {
    it('creates a deterministic inclusive month scale', () => {
        const scale = createTimelineScale(new Date(2026, 7, 1))

        expect(scale).toEqual({
            baseline: { year: 2018, month: 1 },
            current: { year: 2026, month: 8 },
            months: 104,
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

    it('keeps the main-lane date left when the nearby title is on the right', () => {
        const entries = [
            createEntry('duration', {
                type: 'duration',
                start: { year: 2020, month: 1 },
                end: { year: 2021, month: 1 },
            }),
            createEntry('point', {
                type: 'point',
                at: { year: 2020, month: 2 },
                titleSide: 'right',
            }),
        ]

        expect(getDateLabelSides(entries).get('duration:start')).toBe('left')
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
            ['first', -24],
            ['second', 24],
        ]))
    })

    it('preserves an explicit offset when no collision exists', () => {
        const scale = createTimelineScale(new Date(2026, 7, 1))
        const entry = createEntry('offset', {
            type: 'point',
            at: { year: 2020, month: 1 },
            titleOffset: 32,
        })

        expect(resolveTimelineTitleOffsets([entry], scale, 1000, new Map([['offset', 40]]))).toEqual(new Map([['offset', 32]]))
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
