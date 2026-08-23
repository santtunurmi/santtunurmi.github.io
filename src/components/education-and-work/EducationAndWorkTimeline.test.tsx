import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import EducationAndWorkTimeline from './EducationAndWorkTimeline'
import { educationAndWorkTimeline } from './education-and-work-data'
import type { TimelineEntry, TimelineScale } from './timeline-types'

const entry: TimelineEntry = {
    id: 'project',
    title: 'Project title',
    organization: 'Organization',
    location: 'Location',
    period: 'June 2025 – present',
    geometry: {
        type: 'duration',
        start: { year: 2025, month: 6 },
        end: 'current',
    },
}

const scale: TimelineScale = {
    baseline: { year: 2025, month: 1 },
    current: { year: 2026, month: 8 },
    months: 20,
}

describe('EducationAndWorkTimeline', () => {
    it('keeps a clicked entry highlighted until its modal begins closing', async () => {
        render(
            <MemoryRouter>
                <EducationAndWorkTimeline entries={[entry]} scale={scale} />
            </MemoryRouter>,
        )

        const trigger = screen.getByRole('button', { name: /Project title/ })
        const timelineEntry = trigger.closest('li')

        fireEvent.click(trigger, { detail: 1 })

        expect(timelineEntry?.classList.contains('education-and-work-timeline-entry--active')).toBe(true)
        fireEvent.click(await screen.findByRole('button', { name: 'Close' }), { detail: 1 })
        expect(timelineEntry?.classList.contains('education-and-work-timeline-entry--active')).toBe(false)
    })

    it('restores focus only when the entry was opened from the keyboard', async () => {
        const { container, rerender } = render(
            <MemoryRouter>
                <EducationAndWorkTimeline entries={[entry]} scale={scale} />
            </MemoryRouter>,
        )
        const pointerTrigger = screen.getByRole('button', { name: /Project title/ })

        pointerTrigger.focus()
        fireEvent.click(pointerTrigger, { detail: 1 })
        expect(document.activeElement).not.toBe(pointerTrigger)
        fireEvent(container.querySelector('dialog')!, new Event('cancel', { cancelable: true }))
        await waitFor(() => expect(container.querySelector('dialog')?.hasAttribute('open')).toBe(false), { timeout: 1500 })
        expect(document.activeElement).not.toBe(pointerTrigger)

        rerender(
            <MemoryRouter>
                <EducationAndWorkTimeline entries={[entry]} scale={scale} />
            </MemoryRouter>,
        )
        const keyboardTrigger = screen.getByRole('button', { name: /Project title/ })

        fireEvent.click(keyboardTrigger, { detail: 0 })
        fireEvent(container.querySelector('dialog')!, new Event('cancel', { cancelable: true }))
        await waitFor(() => expect(document.activeElement).toBe(keyboardTrigger), { timeout: 1500 })
    })

    it('renders each case study separately before its existing external links', async () => {
        const entries = educationAndWorkTimeline.filter((item) => item.id === 'nuke-liiga-production-manager-2025' || item.id === 'exen-intern-2026')

        render(
            <MemoryRouter>
                <EducationAndWorkTimeline entries={entries} scale={scale} />
            </MemoryRouter>,
        )

        fireEvent.click(screen.getByRole('button', { name: /Production Manager/ }), { detail: 1 })
        const nukeCaseStudy = await screen.findByRole('link', { name: 'Esports Event Production at NUKE-Liiga' })

        expect(screen.getByRole('heading', { level: 3, name: 'Case study' })).not.toBeNull()
        expect(nukeCaseStudy.closest('section')).not.toBeNull()
        expect(screen.getByRole('link', { name: 'Click here to view the second season LAN final aftermovie!' }).closest('section')).toBeNull()

        fireEvent.click(screen.getByRole('button', { name: 'Close' }), { detail: 1 })
        await waitFor(() => expect(screen.queryByRole('link', { name: 'Esports Event Production at NUKE-Liiga' })).toBeNull(), { timeout: 1500 })
        fireEvent.click(screen.getByRole('button', { name: /Software Development Intern/ }), { detail: 1 })

        expect(await screen.findByRole('link', { name: 'Software Development Internship at EXEN esports Oy' })).toMatchObject({ pathname: '/blog/exen-internship' })
        expect(screen.getByRole('link', { name: 'https://exen.fi/en/front-page/' }).closest('section')).toBeNull()
    })
})
