import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { educationAndWorkTimeline } from './education-and-work-data'

describe('educationAndWorkTimeline', () => {
    it('uses unique identifiers and complete core content fields', () => {
        const entryIds = educationAndWorkTimeline.map((entry) => entry.id)

        expect(new Set(entryIds).size).toBe(entryIds.length)

        for (const entry of educationAndWorkTimeline) {
            expect(entry.id.trim()).not.toBe('')
            expect(entry.title.trim()).not.toBe('')
            expect(entry.organization.trim()).not.toBe('')
            expect(entry.location.trim()).not.toBe('')
            expect(entry.period.trim()).not.toBe('')
        }
    })

    it('uses valid geometry months', () => {
        for (const entry of educationAndWorkTimeline) {
            const geometry = entry.geometry
            const months = geometry.type === 'duration'
                ? [geometry.start, ...(geometry.end === 'current' ? [] : [geometry.end])]
                : [geometry.at]

            for (const month of months) {
                expect(month.month).toBeGreaterThanOrEqual(1)
                expect(month.month).toBeLessThanOrEqual(12)
            }
        }
    })

    it('uses complete typed links', () => {
        const links = educationAndWorkTimeline.flatMap((entry) => entry.links ?? [])

        expect(links.length).toBeGreaterThan(0)

        for (const link of links) {
            expect(link.title.trim()).not.toBe('')
            expect(link.text.trim()).not.toBe('')

            if (link.type === 'internal') {
                expect(link.to.startsWith('/')).toBe(true)
            } else {
                expect(['http:', 'https:']).toContain(new URL(link.href).protocol)
            }
        }
    })

    it('uses complete image metadata that resolves to public assets', () => {
        const images = educationAndWorkTimeline.flatMap((entry) => entry.images ?? [])

        expect(images.length).toBeGreaterThan(0)

        for (const image of images) {
            expect(image.src.startsWith('/')).toBe(true)
            expect(image.alt.trim()).not.toBe('')
            expect(existsSync(join(process.cwd(), 'public', image.src.slice(1)))).toBe(true)
        }
    })
})
